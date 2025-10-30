'use strict';

const { expect } = require('chai');
const { injector } = require('../index.js');
const vm = require('vm');

// Helper function to verify code is compileable
function expectCompileable(code, context = {}) {
    expect(() => {
        const script = new vm.Script(code);
        const vmContext = vm.createContext(context);
        script.runInContext(vmContext);
    }).to.not.throw();
}

// Helper function to verify code compilation only (not execution)
function expectCompileableOnly(code) {
    expect(() => {
        new vm.Script(code);
    }).to.not.throw();
}

describe('Open Loop Killer - Injector', function() {

    describe('While Loop Injection', function() {
        it('should inject protection code into a simple while loop', function() {
            const code = `while(true) { }`;
            const result = injector(code);
            console.log(
                result
            );
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expect(result).to.include('Open Loop Detected!');
            expectCompileableOnly(result);
        });

        it('should inject protection code into while loop with condition', function() {
            const code = `
                let i = 0;
                while(i < 100) {
                    i++;
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('1000');
            expectCompileable(result);
        });

        it('should inject protection code into while loop with single statement body', function() {
            const code = `while(true) console.log('test');`;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileableOnly(result);
        });
    });

    describe('For Loop Injection', function() {
        it('should inject protection code into a simple for loop', function() {
            const code = `for(let i = 0; i < 10; i++) { }`;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileable(result);
        });

        it('should inject protection code into for loop with body', function() {
            const code = `
                for(let i = 0; i < 10; i++) {
                    console.log(i);
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('Open Loop Detected!');
            expectCompileable(result, { console: { log: () => {} } });
        });

        it('should inject protection code into infinite for loop', function() {
            const code = `for(;;) { }`;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileableOnly(result);
        });

        it('should inject protection code into for loop with single statement', function() {
            const code = `for(let i = 0; i < 10; i++) console.log(i);`;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileable(result, { console: { log: () => {} } });
        });
    });

    describe('Do-While Loop Injection', function() {
        it('should inject protection code into do-while loop', function() {
            const code = `
                let i = 0;
                do {
                    i++;
                } while(i < 10);
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileable(result);
        });

        it('should inject protection code into infinite do-while loop', function() {
            const code = `do { } while(true);`;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('1000');
            expectCompileableOnly(result);
        });
    });

    describe('Nested Loops', function() {
        it('should inject protection code into nested while loops', function() {
            const code = `
                while(true) {
                    while(true) {
                        break;
                    }
                    break;
                }
            `;
            const result = injector(code);
            
            // Should have multiple injection points
            const dateNowCount = (result.match(/Date\.now\(\)/g) || []).length;
            expect(dateNowCount).to.be.at.least(4); // 2 before loops + 2 inside loops
            expectCompileable(result);
        });

        it('should inject protection code into nested for loops', function() {
            const code = `
                for(let i = 0; i < 10; i++) {
                    for(let j = 0; j < 10; j++) {
                        console.log(i, j);
                    }
                }
            `;
            const result = injector(code);
            
            const dateNowCount = (result.match(/Date\.now\(\)/g) || []).length;
            expect(dateNowCount).to.be.at.least(4);
            expectCompileable(result, { console: { log: () => {} } });
        });

        it('should inject protection code into mixed nested loops', function() {
            const code = `
                for(let i = 0; i < 10; i++) {
                    while(i < 5) {
                        i++;
                    }
                }
            `;
            const result = injector(code);
            
            const dateNowCount = (result.match(/Date\.now\(\)/g) || []).length;
            expect(dateNowCount).to.be.at.least(4);
            expectCompileable(result);
        });
    });

    describe('Code Without Loops', function() {
        it('should return code unchanged if no loops present', function() {
            const code = `
                let x = 5;
                let y = 10;
                console.log(x + y);
            `;
            const result = injector(code);
            
            expect(result).to.not.include('Date.now()');
            expect(result).to.include('let x = 5');
            expectCompileable(result, { console: { log: () => {} } });
        });

        it('should handle function declarations without loops', function() {
            const code = `
                function test() {
                    return 42;
                }
            `;
            const result = injector(code);
            
            expect(result).to.not.include('Date.now()');
            expect(result).to.include('function test');
            expectCompileable(result);
        });
    });

    describe('Loops Inside Functions', function() {
        it('should inject protection into loops inside functions', function() {
            const code = `
                function test() {
                    while(true) {
                        break;
                    }
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('throw new Error');
            expectCompileable(result);
        });

        it('should inject protection into multiple loops in different functions', function() {
            const code = `
                function test1() {
                    for(let i = 0; i < 10; i++) { }
                }
                function test2() {
                    while(true) { break; }
                }
            `;
            const result = injector(code);
            
            const dateNowCount = (result.match(/Date\.now\(\)/g) || []).length;
            expect(dateNowCount).to.be.at.least(4);
            expectCompileable(result);
        });
    });

    describe('Complex Code Structures', function() {
        it('should handle loops with complex bodies', function() {
            const code = `
                for(let i = 0; i < 10; i++) {
                    if(i % 2 === 0) {
                        console.log('even');
                    } else {
                        console.log('odd');
                    }
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('even');
            expect(result).to.include('odd');
            expectCompileable(result, { console: { log: () => {} } });
        });

        it('should handle loops with try-catch blocks', function() {
            const code = `
                while(true) {
                    try {
                        doSomething();
                    } catch(e) {
                        break;
                    }
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('Date.now()');
            expect(result).to.include('try');
            expect(result).to.include('catch');
            expectCompileable(result, { doSomething: () => { throw new Error('test'); } });
        });
    });

    describe('Error Handling', function() {
        it('should throw error for invalid JavaScript syntax', function() {
            const code = `while(true) { this is invalid }`;
            
            expect(() => injector(code)).to.throw();
        });

        it('should throw error for incomplete code', function() {
            const code = `while(true) {`;
            
            expect(() => injector(code)).to.throw();
        });

        it('should handle empty code', function() {
            const code = ``;
            
            const result = injector(code);
            expect(result).to.equal('');
        });

        it('should handle code with only whitespace', function() {
            const code = `   \n\n   `;
            
            const result = injector(code);
            expect(result.trim()).to.equal('');
        });
    });

    describe('Variable Name Collision Prevention', function() {
        it('should use unique variable names for each loop', function() {
            const code = `
                while(true) { break; }
                for(;;) { break; }
            `;
            const result = injector(code);
            
            // Extract all variable names that start with underscore
            const varMatches = result.match(/let _\w+/g) || [];
            // Should have at least 2 unique variable declarations
            expect(varMatches.length).to.be.at.least(2);
            expectCompileable(result);
        });

        it('should not conflict with existing variables', function() {
            const code = `
                let _abc = 5;
                while(true) {
                    console.log(_abc);
                    break;
                }
            `;
            const result = injector(code);
            
            expect(result).to.include('let _abc = 5');
            expect(result).to.include('Date.now()');
            expectCompileable(result, { console: { log: () => {} } });
        });
    });

    describe('Return Value', function() {
        it('should return a string', function() {
            const code = `while(true) { break; }`;
            const result = injector(code);
            
            expect(result).to.be.a('string');
            expectCompileable(result);
        });

        it('should return valid JavaScript code', function() {
            const code = `
                for(let i = 0; i < 10; i++) {
                    console.log(i);
                }
            `;
            const result = injector(code);
            
            // Should be parseable JavaScript
            expect(() => {
                require('esprima').parseScript(result);
            }).to.not.throw();
            expectCompileable(result, { console: { log: () => {} } });
        });
    });

    describe('Edge Cases', function() {
        it('should handle loop with labeled statement', function() {
            const code = `
                outer: while(true) {
                    break outer;
                }
            `;
            const result = injector(code);
            
            // Should not break on labeled statements (even if injection doesn't occur)
            expect(result).to.be.a('string');
            expect(result).to.include('outer:');
            expect(result).to.include('while');
            expectCompileable(result);
        });

        it('should handle for-in loop', function() {
            const code = `
                const obj = {a: 1, b: 2};
                for(let key in obj) {
                    console.log(key);
                }
            `;
            const result = injector(code);
            
            // Note: for-in is not currently handled, but should not break
            expect(result).to.be.a('string');
            expectCompileable(result, { console: { log: () => {} } });
        });

        it('should handle for-of loop', function() {
            const code = `
                const arr = [1, 2, 3];
                for(let val of arr) {
                    console.log(val);
                }
            `;
            const result = injector(code);
            
            // Note: for-of is not currently handled, but should not break
            expect(result).to.be.a('string');
            expectCompileable(result, { console: { log: () => {} } });
        });
    });
});

