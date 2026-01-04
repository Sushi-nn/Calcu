let output = document.getElementById("output");
let prevEq = document.getElementById("prevEq");
let expression = "";
let resultDisplayed = false;

function buttonNum(num) {
    if (resultDisplayed) {
        expression = num.toString();
        resultDisplayed = false;
    } else {
        if (expression === "0") {
            expression = num.toString();
        } else {
            let match = expression.match(/(\d+\.?\d*)$/);
            if (match && match[0] === "0" && num === 0) {
                return;
            }
            if (match && match[0] === "0" && num !== 0 && !match[0].includes(".")) {
                expression = expression.slice(0, -1) + num.toString();
            } else {
                expression += num.toString();
            }
        }
    }
    output.innerText = expression;
}

function setOperator(op, button) {
    if (expression !== "" || resultDisplayed) {
        if (!isNaN(expression.slice(-1))) {
            expression += op;
        } else {
            expression = expression.slice(0, -1) + op;
        }
        output.innerText = expression;
        document.querySelectorAll('.ope').forEach(btn => btn.classList.remove('selected'));
        if (button) button.classList.add('selected');
        resultDisplayed = false;
    }
}

// ✅ Troll version of calculate()
function calculate() {
    if (expression !== "") {
        prevEq.innerText = expression;
        output.innerText = "PAKYU";   // Always show "Pakyu"
        expression = "PAKYU";         // Update state
        resultDisplayed = true;
        document.querySelectorAll('.ope').forEach(btn => btn.classList.remove('selected'));
    }
}

function change() {
    let m = expression.match(/(\d+\.?\d*)$/);
    if (!m) return;
    let numStr = m[0];
    let start = expression.length - numStr.length;
    let charBefore = start > 0 ? expression[start - 1] : null;
    let prevPrev = start > 1 ? expression[start - 2] : null;
    if (charBefore === '-' && start > 0 && /[0-9.]/.test(prevPrev || '')) {
        return;
    }
    if (charBefore === '-' && (start === 0 || /[+\-*/]/.test(prevPrev || ''))) {
        expression = expression.slice(0, start - 1) + numStr;
    } else {
        expression = expression.slice(0, start) + '-' + numStr;
    }
    output.innerText = expression;
}

function remAll() {
    expression = "0";
    output.innerText = "0";
    prevEq.innerText = "";
    resultDisplayed = false;
    document.querySelectorAll('.ope').forEach(btn => btn.classList.remove('selected'));
}

function per() {
    let match = expression.match(/(\d+\.?\d*)$/);
    if (match) {
        let num = parseFloat(match[0]) / 100;
        expression = expression.replace(/(\d+\.?\d*)$/, num.toString());
        output.innerText = expression;
    }
}

function bS() {
    expression = expression.slice(0, -1);
    output.innerText = expression || "0";
}

function dec() {
    if (expression === "" || /[^0-9]$/.test(expression) || expression === "0") {
        expression = "0.";
    } else {
        let match = expression.match(/(\d+\.?\d*)$/);
        if (match && !match[0].includes('.')) {
            expression += '.';
        }
    }
    output.innerText = expression;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        buttonNum(parseInt(key));
    } else if (key === '.') {
        dec();
    } else if (['+', '-', '*', '/'].includes(key)) {
        if (expression !== "" || resultDisplayed) {
            setOperator(key, document.getElementById('bt' + key));
        }
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        bS();
    } else if (key === 'Escape') {
        remAll();
    }
});
