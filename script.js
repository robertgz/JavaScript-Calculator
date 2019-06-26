var calc = (function() {
  var calcData = {
    currentState: null, 
    // {type: "number", value: "0"} | {type: "opp", value: "+"}
    expArr: [], // array of curentStates 
    opSt: "/*-+",    
    expresion: null,
    result: null,
    resultVal: 0,
    hasResult: false
  };

  return {
    init: function(result, expresion) {
      calcData.result = result;
      calcData.expresion = expresion;
    },

    newOperator: function(opperator = "") {
      return this.newItem("opp", opperator);
    },
    newNumber: function(number = "0") {
      return this.newItem("number", number);
    },
    newItem: function(newType, newValue) {
      return { type: newType, value: newValue };
    },

    equal: function() {
      var result = calc.calcResult();
      if (result === null) {
        console.log("No results.");
        return;
      }
      
      calcData.resultVal = result;
      calcData.hasResult = true;
      
      calcData.result.text(calcData.resultVal);
      calcData.expresion.text(calc.getExpStr() + "=" + calcData.resultVal);
      
      calcData.currentState = null;
      calcData.expArr = [];
    },
    
    calcResult: function() {
      var expression = calc.getExpArr();
      var expectNumber = null;
      
      if ((expression.length < 1) || (expression[expression.length-1].type === "opp")){
        return null;
      }
      
        function doMath(obj){
          return Function('return ' + obj)();
        }            

        console.log(calc.getExpStr());
        var testResult = doMath(calc.getExpStr());
        
        console.log(testResult);
        return testResult;
    },

    
    getExpArr: function() {
      var expresion = [];
      
      if (calcData.expArr.length > 0) {
        expresion = expresion.concat(calcData.expArr);
      }
      
      if (calcData.currentState !== null) {
        expresion = expresion.concat(calcData.currentState);
      }        
      
      return expresion;
    },
    
    getExpStr: function() {      
      return calc.getExpArr().map(function(data) {
        return data.value;
      }).join("");
    },

    
    appendExp: function(data) {
      if (data.length === 1) {
        var opIndex = calcData.opSt.indexOf(data);

        if (opIndex >= 0) {
          calcData.expArr.push(calcData.currentState);
          calcData.currentState = calc.newOperator(data);
          return calcData.currentState;
        } else return "-1X";
      }
    },

    changeOperator: function(event) {
      console.log($(this).data("opp"));
      
      if (calcData.hasResult) {
        calcData.currentState = calc.newNumber(calcData.resultVal);
        calcData.resultVal = 0;
        calcData.hasResult = false;
      }
      
      if (calcData.currentState === null) {
        return;
      }
        
      if (calcData.currentState.type !== "opp") {
        calcData.expArr.push(calcData.currentState);
      }

      calcData.currentState = calc.newOperator($(this).data("opp"));
      calc.displayOutput();
    },

    ac: function() {
      calc.clear("AC");
    },
    ce: function() {
      calc.clear("CE");
    },

    clear: function(clearType) {
      if (calcData.hasResult) {
        clearType = "AC";
        calcData.resultVal = 0;
        calcData.hasResult = false;
      }
      
      if (clearType === "CE") {
        if (calcData.currentState.type === "number") {
          calcData.currentState = calc.newNumber("0");          
        } 

      } else if (clearType === "AC") {
        calcData.expArr = [];
        calcData.currentState = null;  
      }

      calc.displayOutput();
    },

    displayOutput: function() {
      if (calcData.currentState === null) {
        calcData.result.text("0");
      } else if (calcData.currentState.type === "number") {
        calcData.result.text(calcData.currentState.value);
      }
      
      if ((calcData.expArr.length <= 0) && (calcData.currentState === null)) {
        calcData.expresion.text("0");
      } else {
        calcData.expresion.text(this.getExpStr);
      }
    },

    changeNumber: function(event) {
      console.log($(this).data("number"));
      
       if (calcData.currentState === null) {
         calcData.currentState = calc.newNumber($(this).data("number").toString());
         calc.displayOutput();
         return;
      }     
      
      if (calcData.currentState.type !== "number") {
        calcData.expArr.push(calcData.currentState);
        calcData.currentState = calc.newNumber("0");
      }

      calc.updateNumber($(this).data("number"));
    },
    
    updateNumber: function(newData) {
      if (calcData.currentState.value === "0") {
        // console.log("zero 0: ");
        if (newData === "0") {
          return;
        }
        // Do not append a second zero to an initial zero. Avoid "00"

        if (newData === ".") {
          calcData.currentState.value += newData;
          // A . can be appended to a "0" to form a "0."
        } else {
          calcData.currentState.value = newData.toString();
          // Replace the "0" with the new number
        }

        this.displayOutput();
        return;
      }

      if (calcData.currentState.value.length < 8) {
        if (newData === ".") {
          if (!calcData.currentState.value.includes(".")) {
            calcData.currentState.value += newData;
          } // prevent addending more than one decimal
        } else {
          calcData.currentState.value += newData.toString();
        }
      } else {
        calcData.currentState.value = "0";
      }
      this.displayOutput();
    }
  };
})();

$(document).ready(function() {
  calc.init($("#result"), $("#expression"));

  calc.displayOutput();
  $(".num").on("click", calc.changeNumber);
  $(".decimal").on("click", calc.changeNumber);
  $(".operator").on("click", calc.changeOperator);

  $("#ce").on("click", calc.ce);
  $("#ac").on("click", calc.ac);
  
  $("#equal").on("click", calc.equal);
  
});