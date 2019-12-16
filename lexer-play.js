'use strict'
// https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are
// That looks to be a good resource for definitions.


// This is one of those things that seemed like a good idea at the time.
// Stupidly over-complicated for what it actually achieves, but the architecture may allow parsing something much more complex. 

// This file stands alone; as such there's no way to share the code with lexer-lookup.js and some copy-pasting as occurred. 


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
	
	function moveAlong() {
		result.push(currObj);
		currObj = {};
	}
	
	forloop: // All hail, the glorious GOTO
	for (let pos = 0; pos < inputStr.length; pos++) {
		
		let currChr = inputStr[pos];
		
		switch (currState) {
			case State.NONE:
				if (numbers.includes(currChr)) {
					currObj.type = 'number';
					currObj.value = currChr;
					currState = State.NUMBER;
				} else if (currChr == ' ') {
					// No Op.
				} else if (operators.includes(currChr)) {
					currObj.type = 'operator';
					currObj.value = currChr;
					currState = State.OPERATOR; // Pointess here, but to be clear: Never expect a second operator.
				} else {
					errorPos = pos;
					break forloop;
				}
				break;
				
			case State.NUMBER:
				if (numbers.includes(currChr)) {
					currObj.value += currChr;
				} else if (currChr == ' ') {
					moveAlong();
					currState = State.NONE;
				} else if (operators.includes(currChr)) {
					moveAlong();
					
					currObj.type = 'operator';
					currObj.value = currChr;
					currState = State.NONE; // Is this enough?
				} else {
					errorPos = pos;
					break forloop;
				}
				break;
				
			case State.OPERATOR:
				if (numbers.includes(currChr)) {
					moveAlong();
					
					currObj.type = 'number'
					currObj.value += currChr;
				} else if (currChr == ' ') {
					moveAlong();
					currState = State.NONE;
				} else if (operators.includes(currChr)) {
					moveAlong();
					
					currObj.type = 'operator';
					currObj.value = currChr;
					currState = State.OPERATOR; // Is this enough?
				} else {
					errorPos = pos;
					break forloop;
				}
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