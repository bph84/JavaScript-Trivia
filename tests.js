'use strict';
// As written below, most of this file is designed around strict mode, but 
// there are a few non-strict mode quirks I wanted to explore. 


// THIS FILE IS EXCLUSIVELY WRITTEN FOR MY OWN PRACTICE AND REFERENCE. 



const UNREACHABLE_MSG = "This should have been unreachable code";
const FAIL_MSG = "You should never see this in the console.";


function isStrict() { 
    return !this; 
};

if (!isStrict()) {
    console.log("Tests not carried out in strict mode, which while valid, isn't the focus of this file");
}

(function strictFunction() {
    'use strict'; //Ensures we're in strict mode.
    expectError(() => {
        x = 'nope!';
    }, 'x is not defined');
})();

function expectError(shouldThrow, errorText) {
    // Slightly head bending, so... Four possible outcomes:
    // 1 We get an error which matches the given error text. All good ✓.
    // 2 We get an error which does not match the given error text. Not good ⚠. 
    // 3 We get an error but don't have errorText. OK, but not ideal 🕑.  
    // 4 We don't get an error. Definitely not good ⚠⚠. 
    
    let tryResult;
    
    try {
        shouldThrow();
        console.error(UNREACHABLE_MSG); //Bad error. Outcome 4. 
    } catch (error) {
    //Good error.
    tryResult = error.message; //Possibly an error here. (Unexpected and therefore real)
    } finally {
        if (errorText) {
            // We're asserting we've got the correct error. 
            if (!tryResult.startsWith(errorText)) {        
                console.error(tryResult + " doesn't start with " + errorText); 
                // outcome 2
            } // else is outcome 1
        } else {
            //Logging since ideally we'd be specifying the error. 
            console.log("Expected error returned: " + tryResult);
            //Outcome 3.
        }
    }
}

// -------------------- START OF ACTUAL STUFF -------------------------------//

expectError(() => {
    throw new Error("Toys out of the pram?");
}, "Toys out");


try {
    throw 42;
} catch(error) {
    console.assert(error === 42);
    // Holy crap. So, the thing you catch can be any kind of variable. 
    
}


(function() {
    console.assert(true || commitSeppuku()) //Seppuku bad. Don't do Seppuku. 
    console.assert(!(false && commitSeppuku()));
    
    console.assert(! ("test" == "test" == "test")); // This is here since it tripped me up! 
    console.assert("test" == "test" != "test");
})();

(function() {
    // LOOPS! - Gone through this several times now!
    const array = [1,2,3];
    let resultArray = [];
    for (let value of array) {
        resultArray.push(value);
    }
    
    console.assert('1,2,3' == array.toString(), 'First Array Comparison failing');
    console.assert('1,2,3' == resultArray.toString(), "Array comparison failing"); //No [] in the toString. 

    const object = { //Variable name from MDN in their trivial example. 
        a: 1, b: 2, c: 3
    };
    let resultObject = {};
    for (let property in object) {
        resultObject[property] = object[property];
    }
    
    console.assert(JSON.stringify(object) == JSON.stringify(resultObject));

})();

(function() {
    var aVar;
    console.assert(aVar === undefined, FAIL_MSG);
}
)();

(function() {
    // Basically; never use var. let and const are the future. 
    if (true) {
        var varVar = 1; //Function scope. 
        let letVar = 1;
        const constVar = 1;
    }
    
    console.assert(varVar == 1);
    
    console.assert('undefined' === typeof letVar);
    console.assert('undefined' === typeof constVar);
    
    expectError(() => {
        console.assert(letVar == 1);
    }, "letVar is not defined");
})();

expectError(() => {
    console.log(undeclaredVar);
}, "undeclaredVar is not defined");




(function() {
    //UNICODE STUFF
    
    // Basically; JavaScript (de facto) uses UTF-16, most common characters
    // count as 1 JS character (and 2 bytes). Emoji are one notable exception. 

    // A Good explaination of Unicode in the world of JavaScript can be found here:
    // https://mathiasbynens.be/notes/javascript-encoding

    // Originally found some (oldish) code from https://github.com/bestiejs/punycode.js
    // which might be useful.

    console.assert((255).toString(16) == "ff");

    const helloJapaneseWorld = "こんにちは世界"; //Japanese, 7 arrow key presses
    const helloThaiWorld = "สวัสดีชาวโลก"; //Thai. 12 arrow key presses
    
    
    console.assert(helloJapaneseWorld.length, 7);
    console.assert(helloThaiWorld.length, 12); // Remember that ี is a character;
    console.assert("ี".length, 1);
    console.assert("ดี".length, 2);
    
    for (let i = 0; i < helloJapaneseWorld.length; i++) {
        console.assert(
            helloJapaneseWorld.codePointAt(i) == helloJapaneseWorld.charCodeAt(i)
        ); //For most Japanese, this is all good. 
    }

    const hmmmm = "🤔"; // The 'Thinking Face' emoji, renders in Notepad++ and Chrome. 
    console.assert(hmmmm.codePointAt(0) == 129300);
    console.assert(hmmmm.length == 2);
    //two 16 bit er, things. 

    const orangutan = "🦧"; //Orangutan, new for 2019. Renders in Notepad++ in March 2021, but didn't in December 2019.
    // /əˈɹæŋ.ə.tæn/    
    
    console.assert(orangutan.codePointAt(0) == 129447);
    console.assert(orangutan.codePointAt(0).toString(16) == "1f9a7"); // Unicode is usually written U+1F9A7
    console.assert(orangutan.length == 2);

    console.assert(hmmmm.codePointAt(0) != hmmmm.charCodeAt(0));
    console.assert(hmmmm.codePointAt(1) == hmmmm.charCodeAt(1));

    let forInterations = 0;
    for (const s of hmmmm) {
        forInterations++;
    }
    
    console.assert(forInterations == 1);
    // So, for char of string iterates over each unicode character.
    // This would be different if you used an old, c-style with string.length
}
)();

(function() {
    // JavaScript quirks


    // Functions are 'hoisted', classes are not. 
    
    let throwAway = Noop();

    function Noop() {
        return "this function returns this string";
    }

    expectError(() => {
        const unHoisted = new Tests();
    }, "Cannot access 'Tests'");


    class Tests {
        constructor() {}
    }

    console.assert((new Tests()).name === undefined);
    //Anonymous classes don't have a name
    
    console.assert(Tests.name === 'Tests');
    // Classes do.

}
)();

(function() {
    // Higher order function support, which means
    // in JavaScript you can in fact return an anonymous function. 
    function gimmeAnF() {
        return () => {
            return "Is your mind bent yet?";
        }
    }
    
    console.assert(gimmeAnF()() == "Is your mind bent yet?");
    
})();



(async function() {
    // Binary Representations


    if (typeof window !== 'undefined') { //Don't break NodeJS, which doesn't provide a window. 
        console.assert(window.btoa('test') == "dGVzdA==");
        console.assert(window.atob('dGVzdA==') == "test");
    }
    
    function toHexString(byteArray) {
        return Array.from(byteArray, function(inByte) {
            return ('0' + (inByte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }

    function toArrayBuffer(inputString) {
        let len = inputString.length;
        let resultBytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
            resultBytes[i] = inputString.charCodeAt(i);
        }
        
        return resultBytes.buffer;
    }

    if (typeof crypto !== 'undefined') { //Use Feature detection rather than environment detection
        const digest = await crypto.subtle.digest("sha-1", toArrayBuffer('test'));
        
        console.assert(toHexString(new Uint8Array(digest)) == "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3");
    }
    
    // --- For reference
    // bph@localhost:~# echo -n 'test' | sha1sum
    // returns a94a8fe5ccb19ba61c4c0873d391e987982fbbd3
}
)();


(function() {

    let object1 = new Object();

    console.assert(object1.randomProperty == undefined);
    console.assert(object1.toString != undefined);

    console.assert(object1.hasOwnProperty('toString') == false);
    console.assert(object1.hasOwnProperty('hasOwnProperty') == false);

}    
)();

(function() {
    var myObject = {
        foo: "bar",
        func: function() {
            var self = this;
            
            console.assert(self === this);
             
            (function() {
                
                if (isStrict()) {
                    expectError( () => {
                        console.assert(typeof this.foo == "undefined");
                    }, "Cannot read property 'foo"); 
                } else {
                    console.assert(typeof this.foo == "undefined");
                }
                
                console.assert(self.foo == "bar");
            }());
        }
    };
    myObject.func();
})();


(function() {
    // It's definitely worth remembering that maths is wrong in JS. 

    console.assert(0.1 + 0.2 != parseInt('0.3'));
    console.assert(0.1 + 0.2 == 0.1 + 0.1 + 0.1);
    console.assert(0.1 + 0.2 != 3 / 10);
    
    console.assert(isNaN(parseInt('hello', 10)));
    
    
    // https://stackoverflow.com/a/23666623
    console.assert(Number.NaN != Number.NaN); // This is intentional. 
    console.assert(isNaN(parseInt('hello', 10)));
    console.assert(parseInt('hello', 10) != Number.NaN); //Not because of JS though. This is the IEEE. 
    console.assert(!isFinite(1 / 0), "Divide by zero"); //Surely the IEEE wouldn't condone this? (Too lazy; didn't Google).
})();