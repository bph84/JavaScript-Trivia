'use strict';

// THIS FILE IS EXCLUSIVELY WRITTEN FOR MY OWN PRACTICE AND REFERENCE. 
// There have been times in my life I wouldn't have ever dreamt of
// letting someone see me practice like this. 


function describeArgs() {
	
	let rtn = [];
	
	for (let value of arguments) {
		switch (typeof value) {
			case "number":
				rtn.push('number ' + value.toString());
				break;
		}
	}
	return rtn.join(', ');
}


console.assert(
	describeArgs(1, 2, 3) == "number 1, number 2, number 3",
	"Integer args not working!"
);

console.assert(
	describeArgs(1, true) == "number 1, boolean true",
	"boolean args not working!"
);

console.assert(
	describeArgs(1, "A string") == 'number 1, string "A string"',
	"String args not working!"
);

console.assert(
	describeArgs(1, undefined) == "number 1, undefined, undefined",
	"undefined args not working!"
);