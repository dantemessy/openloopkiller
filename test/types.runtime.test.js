/**
 * Runtime test to verify TypeScript definitions work correctly in practice
 * Tests that the actual runtime behavior matches the TypeScript type definitions
 */

'use strict';

const { expect } = require('chai');
const { injector } = require('../index.js');

describe('TypeScript Definitions - Runtime Verification', function() {

    describe('Basic Functionality', function() {
        it('should work without options parameter', function() {
            const code = 'while(true) { console.log("test"); }';
            const result = injector(code);
            
            expect(result).to.be.a('string');
            expect(result).to.include('Date.now()');
        });

        it('should return string type as declared in TypeScript definitions', function() {
            const code = 'for(let i = 0; i < 10; i++) { }';
            const result = injector(code);
            
            expect(result).to.be.a('string');
        });
    });

    describe('InjectorOptions Interface', function() {
        describe('timeout option', function() {
            it('should accept numeric timeout value', function() {
                const code = 'for(let i = 0; i < 10; i++) { console.log(i); }';
                const result = injector(code, { timeout: 2000 });
                
                expect(result).to.be.a('string');
                expect(result).to.include('2000');
            });

            it('should throw error for invalid timeout (negative number)', function() {
                const code = 'while(true) {}';
                
                expect(() => {
                    injector(code, { timeout: -1 });
                }).to.throw();
            });

            it('should throw error for invalid timeout (string instead of number)', function() {
                const code = 'while(true) {}';
                
                expect(() => {
                    // @ts-expect-error - Testing runtime validation for invalid type
                    injector(code, { timeout: '1000' });
                }).to.throw();
            });
        });

        describe('errorMessage option', function() {
            it('should accept string errorMessage value', function() {
                const code = 'do { console.log("test"); } while(true);';
                const result = injector(code, { errorMessage: 'Loop timeout!' });
                
                expect(result).to.be.a('string');
                expect(result).to.include('Loop timeout!');
            });

            it('should throw error for invalid errorMessage (number instead of string)', function() {
                const code = 'while(true) {}';
                
                expect(() => {
                    // @ts-expect-error - Testing runtime validation for invalid type
                    injector(code, { errorMessage: 123 });
                }).to.throw();
            });
        });

        describe('combined options', function() {
            it('should accept both timeout and errorMessage options', function() {
                const code = 'for(const key in obj) { console.log(key); }';
                const result = injector(code, { 
                    timeout: 5000, 
                    errorMessage: 'Custom error message' 
                });
                
                expect(result).to.be.a('string');
                expect(result).to.include('5000');
                expect(result).to.include('Custom error message');
            });

            it('should work with full InjectorOptions interface', function() {
                const options = {
                    timeout: 3000,
                    errorMessage: 'Test message'
                };
                const result = injector('for(let i=0; i<10; i++) {}', options);
                
                expect(result).to.be.a('string');
                expect(result).to.include('3000');
                expect(result).to.include('Test message');
            });
        });

        describe('optional options', function() {
            it('should work with empty options object', function() {
                const code = 'while(true) { break; }';
                const result = injector(code, {});
                
                expect(result).to.be.a('string');
                expect(result).to.include('Date.now()');
            });

            it('should work with only timeout specified', function() {
                const code = 'for(;;) { break; }';
                const result = injector(code, { timeout: 1500 });
                
                expect(result).to.be.a('string');
                expect(result).to.include('1500');
            });

            it('should work with only errorMessage specified', function() {
                const code = 'do { break; } while(true);';
                const result = injector(code, { errorMessage: 'Error!' });
                
                expect(result).to.be.a('string');
                expect(result).to.include('Error!');
            });
        });
    });

    describe('Error Handling', function() {
        it('should throw error for invalid JavaScript syntax', function() {
            expect(() => {
                injector('while true { }');
            }).to.throw();
        });

        it('should throw error as declared in JSDoc @throws annotation', function() {
            expect(() => {
                injector('this is not valid javascript');
            }).to.throw(Error);
        });
    });

    describe('Type Definitions Consistency', function() {
        it('should match declared function signature: (code: string, options?: InjectorOptions) => string', function() {
            // Test with string code parameter
            const validCode = 'while(true) { break; }';
            expect(() => injector(validCode)).to.not.throw();
            
            // Test with options parameter
            expect(() => injector(validCode, { timeout: 2000 })).to.not.throw();
            
            // Test return type is string
            const result = injector(validCode);
            expect(result).to.be.a('string');
        });

        it('should handle all documented loop types from JSDoc', function() {
            // While loops
            expect(injector('while(true) { break; }')).to.be.a('string');
            
            // For loops
            expect(injector('for(let i=0; i<10; i++) {}')).to.be.a('string');
            
            // Do-while loops
            expect(injector('do { break; } while(true);')).to.be.a('string');
            
            // For-in loops
            expect(injector('for(let k in {}) {}')).to.be.a('string');
            
            // For-of loops
            expect(injector('for(let v of []) {}')).to.be.a('string');
        });
    });

    describe('Default Values', function() {
        it('should use default timeout of 1000ms when not specified', function() {
            const code = 'while(true) { break; }';
            const result = injector(code);
            
            expect(result).to.include('1000');
        });

        it('should use default errorMessage "Open Loop Detected!" when not specified', function() {
            const code = 'for(;;) { break; }';
            const result = injector(code);
            
            expect(result).to.include('Open Loop Detected!');
        });
    });

    describe('TypeScript Import Scenarios', function() {
        it('should support CommonJS require as shown in type definitions', function() {
            const { injector: importedInjector } = require('../index.js');
            
            expect(importedInjector).to.be.a('function');
            
            const result = importedInjector('while(true) { break; }');
            expect(result).to.be.a('string');
        });

        it('should support destructuring InjectorOptions interface pattern', function() {
            // This tests that the options object structure works as documented
            const options = {
                timeout: 2500,
                errorMessage: 'Timeout occurred'
            };
            
            const code = 'for(let i=0; i<100; i++) {}';
            const result = injector(code, options);
            
            expect(result).to.include('2500');
            expect(result).to.include('Timeout occurred');
        });
    });
});

