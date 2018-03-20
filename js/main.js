'use strict';

var DEFAULT_NUMBER = '';
var INPUT_BOX = 'calculatorInputBox';
var expression = '';

var leftSide = true;
var numberSeparated = false;

var regexNumbers = new RegExp('^[0-9]');
var regexMathematicalSigns = new RegExp('[-+*\/\.=]');

var resetInputBox = false;

function validateRegex(keyPressed, inputValue) {
    clearCalculatorValue();
    var lastExpression = expression;
    var lastChar;
    var inputBoxValue = inputValue.value;

    if (keyPressed.keyCode === 13) {
        buttonInput('=');
        return;
    }
    if (keyPressed.keyCode === 8) {
        lastChar = getLastChar(lastExpression);
        if (lastChar === '.') {
            numberSeparated = false;
            expression = inputBoxValue;
            return;
        }
        expression = inputBoxValue;
        return;
    }
    lastChar = getLastChar(inputBoxValue);

    if (regexNumbers.test(lastChar) || regexMathematicalSigns.test(lastChar)) {
        expression += lastChar;
        expression = removeLastChar(inputBoxValue);
        buttonInput(lastChar);
    } else {
        expression = removeLastChar(inputBoxValue);
    }
    return;
}

function buttonInput(inputSymbol) {
    clearCalculatorValue();

    if (!isNaN(inputSymbol)) {
        if (removeZeros(inputSymbol, expression) === 'success') {
            return;
        } else if (removeZeros(inputSymbol, expression) === 'fail') {
            expression = removeLastChar(expression);
        }
        expression += inputSymbol;
        printExpression();
        return;
    }

    if (inputSymbol === 'C') {
        leftSide = true;
        numberSeparated = false;
        expression = DEFAULT_NUMBER;
        document.getElementById(INPUT_BOX).value = expression;
        document.getElementById(INPUT_BOX).placeholder = '';
        return;
    }

    if (inputSymbol === 'del') {
        var lastChar = expression.slice(-1);
        document.getElementById(INPUT_BOX).placeholder = '';
        if (lastChar === '.') {
            numberSeparated = false;
        }
        if (mathematicalSymbol(inputSymbol)) {
            leftSide = true;
        }
        expression = removeLastChar(expression);
        return;
    }

    if (inputSymbol === '=') {
        if (expression.length === 0) {
            document.getElementById(INPUT_BOX).value = DEFAULT_NUMBER;
        } else {
            try {
                expression = '' + eval(expression);
                expression = divideByZeroCheck(expression);
                resetInputBox = true;
            } catch (err) {
                expression = removeLastChar(expression);
                return;
            }
            leftSide = true;
            printExpression();
        }
        return;
    }

    if (mathematicalSymbol(inputSymbol)) {
        if (inputSymbol === '-' && expression.length === 0) {
            expression += inputSymbol;
            printExpression();
        } else {
            numberSeparated = false;
            if (leftSide === false) {
                try {
                    expression = '' + eval(expression);
                    expression = divideByZeroCheck(expression);
                    resetInputBox = true;
                } catch (err) {
                    expression = removeLastChar(expression);
                    return;
                }
                expression += inputSymbol;
                printExpression();
            } else {
                if (expression.length === 0) {
                    document.getElementById(INPUT_BOX).value = DEFAULT_NUMBER;
                } else {
                    expression += inputSymbol;
                    printExpression();
                    leftSide = false;
                }

                return;
            }
        }
        return;
    }
    
    if (inputSymbol === '.') {
        if (numberSeparated === false) {
            numberSeparated = true;
            expression += inputSymbol;
            printExpression();
            return;
        }
        return;
    }
    return;
}

function mathematicalSymbol(symbol) {
    if (symbol === '/' ||
        symbol === '*' ||
        symbol === '-' || symbol === '+') {
        return true;
    }
    return false;
}

function removeLastChar(expression) {
    if (expression.length > 1) {
        expression = expression.substring(0, expression.length - 1);
    } else {
        expression = DEFAULT_NUMBER;
    }
    printExpression();
    return expression;
}

function getLastChar(expression) {
    var lastChar;
    if (expression.length > 1) {
        lastChar = expression.slice(-1);
    } else if (expression.length === 1) {
        lastChar = expression;
    }
    return lastChar;
}

function divideByZeroCheck(expression) {
    if (expression === 'Infinity' || expression === '-Infinity') {
        expression = '';
        printExpression();
        document.getElementById('calculatorInputBox').placeholder = 'Cannot divide by zero';
    }
    return expression;
}

function removeZeros(inputSymbol, expression) {

    if (inputSymbol === 0 && expression.length === 1 && getLastChar(expression) === '0') {
        printExpression();
        return 'success';
    } else if (inputSymbol === 0 && getLastChar(expression) === '0' && leftSide === false) {
        var secondLastCharacter = removeLastChar(expression);
        if (mathematicalSymbol(getLastChar(secondLastCharacter)) === true) {
            printExpression();
            return 'success';
        }
    } else if (expression.length === 1 && inputSymbol !== '.' && getLastChar(expression) === '0') {
        return 'fail';
    } else if (inputSymbol !== '.' && getLastChar(expression) === '0' && leftSide === false) {
        var secondLastCharacter = removeLastChar(expression);
        if (mathematicalSymbol(getLastChar(secondLastCharacter)) === true) {
            printExpression();
            return 'fail';
        }
    }
    return;
}

function clearCalculatorValue() {
    if (resetInputBox === true) {
        leftSide = true;
        expression = DEFAULT_NUMBER;
        printExpression();
        resetInputBox = false
    }
}

function printExpression() {
    document.getElementById(INPUT_BOX).value = expression;
}