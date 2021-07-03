'use strict';

// THIS FILE IS EXCLUSIVELY WRITTEN FOR MY OWN PRACTICE AND REFERENCE. 
// This is not how I would write professional code!

// There have been times in my life I wouldn't have ever dreamt of
// letting someone see me practice like this. 


// " and ' are identical, except obviously in their escapes. 
// I tend to use them interchangably


// actual, expected ordering is apparently controversial. 
// At least actual, expected is alphabetical
function assertEqual(actual, expected, errorMessage) {
	if (actual !== expected) {
		console.log(`assertEqual Fail. Expected:\n${expected}\nActual: ${actual}`);
		
		if ("string" == typeof errorMessage) {
			console.log(errorMessage);
		}
	}
}

function describeArgs() {
	/* This deals with the arguments object, which is a very old JS feature.
	   remember that describeArgs(...args) is possible in modern JS. 
	   
	   arguments is not actually an array. To make it an array:
	   > const args = Array.from(arguments);
	   */
	   
	let rtn = [];
	
	for (let value of arguments) {
		switch (typeof value) {
			case "number":
				rtn.push('number ' + value.toString());
				break;
				
			case "string": 
				rtn.push('string "' + value + '"');
				break;
			
			case "boolean":
				rtn.push(`boolean ${value}`); 
				break;
				
			case "undefined":
				rtn.push('undefined');
				break;
				
			case "function":
				let sample = value.toString().substr(0, 45).replaceAll('\n', '\n>>');
				rtn.push(`function named '${value.name}' and source starting with:\n>> ${sample}`);
				break;
				
			default:
				rtn.push("Unknown type: " + typeof value);
				
		}
	}
	return rtn.join(', ');
}


assertEqual(
	describeArgs(1, 2, 3), "number 1, number 2, number 3",
	"Integer args not working!"
);

assertEqual(
	describeArgs(1, true), "number 1, boolean true",
	"boolean args not working!"
);

assertEqual(
	describeArgs(1, "A string"), 'number 1, string "A string"',
	"String args not working!"
);

assertEqual(
	describeArgs(1, undefined, undefined), "number 1, undefined, undefined",
	"undefined args not working!"
);


function noop(a, b) {
	/* a function's comments */ 
	let notTrue = false;
	if (true == notTrue) {
		console.log("This shouldn't do anything!?");
	}
}

console.assert(
	describeArgs(noop).includes("a function's com"), // 45 characters only
	"describeArgs doesn't include the expected text"
	);