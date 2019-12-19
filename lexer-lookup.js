'use strict'
// https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are
// That looks to be a good resource for definitions.

// This is one of those things that seemed like a good idea at the time.
// Stupidly over-complicated for what it actually achieves, but the architecture may allow parsing something much more complex. 

// This file stands alone; as such there's no way to share the code with lexer-play.js and some copy-pasting as occurred. 



function lexer(inputStr) {
    // let inputStr = `1 + 1`;
    
    const State = {
        NONE: Symbol("none"),
        NUMBER: Symbol("number"),
        OPERATOR: Symbol("operator")
    };
    Object.freeze(State);
    
    
    let numbers = ['1','2','3','4','5','6','7','8','9','0'];
    let operators = ['+', '-', '*', '/'];
    
    
    
    let result = [];
    let currObj = {};
    let currState = State.NONE;
    let errorPos = 0;
    let currChr;
    
    
    let transitions = (function() {
    
        function noOp() {}
        
        function startNumber() {
            currObj.type = 'number';
            currObj.value = currChr;
            currState = State.NUMBER;
        };
        
        function startOperator() {
            currObj.type = 'operator';
            currObj.value = currChr;
            currState = State.OPERATOR;
        };
        
        function justAppend() {
            currObj.value += currChr;
        }
        
        let transitions = [];
        
        transitions[State.NONE] = [];
        transitions[State.NONE]['whitespace']  = noOp;
        transitions[State.NONE]['number'] = startNumber;
        transitions[State.NONE]['operator'] = startOperator;
        
        transitions[State.NUMBER] = [];
        transitions[State.NUMBER]['whitespace'] = function() {
            currState = State.NONE;
        };
        
        transitions[State.NUMBER]['number'] = justAppend;
        transitions[State.NUMBER]['operator'] = startOperator;
        
        transitions[State.OPERATOR] = [];
        transitions[State.OPERATOR]['whitespace'] = function() {
            currState = State.NONE;
        };
        
        transitions[State.OPERATOR]['number'] = startNumber;
        
        transitions[State.OPERATOR]['operator'] = justAppend;
        
        return transitions;
    })();
    
    let dontMoveAlongFor = [
        transitions[State.NONE]['number'],
        transitions[State.NONE]['operator'],
        transitions[State.OPERATOR]['operator'],
        transitions[State.NUMBER]['number'],
    ]
    
    

    
    function moveAlong() {
        result.push(currObj);
        currObj = {};
    }
    
    let previousTransition = null;
    
    for (let pos = 0; pos < inputStr.length; pos++) {
        
        currChr = inputStr[pos];
        
        let currChrType = numbers.includes(currChr) ? 'number' :
                          operators.includes(currChr) ? 'operator' :
                          currChr == ' ' ? 'whitespace' : 'error';
        
        if (transitions[currState][currChrType]) {
            
            if (!dontMoveAlongFor.includes(transitions[currState][currChrType])) { // Yay double negatives /s. 
                moveAlong();
            }
            
            transitions[currState][currChrType](); //Key function call right here. 
        } else {
            console.error("Unknown state transition");
        }
        

    }
    
    if (errorPos != 0) {
        console.error(`Error at position ${errorPos}`);
    }
    
    result.push(currObj);
    return result;
    
    
}

function testLexer() {
    // JSON.stringify is a bit of a hack!
    
    let jss = JSON.stringify;
    
    console.assert(jss(lexer('')) == '[{}]', 'Empty string should return empty array');
    
    console.assert(jss(lexer('123')) == jss([{type: 'number', value: '123'}])); 
    
    console.assert(jss(lexer('123 456 789')) == jss([
        {type: 'number', value: '123'},
        {type: 'number', value: '456'},
        {type: 'number', value: '789'}
        ]));
        
    console.assert(jss(lexer('123 + 456')) == jss([
        {type: 'number', value: '123'},
        {type: 'operator', value: '+'},
        {type: 'number', value: '456'}
        ]));
        
    console.assert(jss(lexer('- + 456')) == jss([
        {type: 'operator', value: '-'},
        {type: 'operator', value: '+'},
        {type: 'number', value: '456'}
        ]));
}


testLexer();