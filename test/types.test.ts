/**
 * TypeScript type definitions test file
 * This file tests that the TypeScript definitions work correctly
 * It should compile without errors when running: npm run test:types
 */

import { injector, InjectorOptions } from '../index';

// Test 1: Basic usage without options
const code1 = 'while(true) { console.log("test"); }';
const result1: string = injector(code1);

// Test 2: Usage with timeout option
const code2 = 'for(let i = 0; i < 10; i++) { console.log(i); }';
const result2: string = injector(code2, { timeout: 2000 });

// Test 3: Usage with errorMessage option
const code3 = 'do { console.log("test"); } while(true);';
const result3: string = injector(code3, { errorMessage: 'Loop timeout!' });

// Test 4: Usage with both options
const code4 = 'for(const key in obj) { console.log(key); }';
const options: InjectorOptions = {
  timeout: 5000,
  errorMessage: 'Custom error message'
};
const result4: string = injector(code4, options);

// Test 5: Empty options object
const code5 = 'for(const item of array) { console.log(item); }';
const result5: string = injector(code5, {});

// Test 6: Options type checking
const validOptions: InjectorOptions = {
  timeout: 3000,
  errorMessage: 'Test message'
};

// Test 7: Partial options
const partialOptions1: InjectorOptions = { timeout: 1500 };
const partialOptions2: InjectorOptions = { errorMessage: 'Error!' };

// Type error tests (these should cause compilation errors if uncommented):
// const invalidOptions1: InjectorOptions = { timeout: "1000" }; // Error: timeout must be number
// const invalidOptions2: InjectorOptions = { errorMessage: 123 }; // Error: errorMessage must be string
// const invalidOptions3: InjectorOptions = { unknownOption: true }; // Error: unknown property
// const invalidResult: number = injector(code1); // Error: result is string, not number
// const invalidCode: string = injector(123); // Error: code must be string

console.log('✓ All TypeScript type checks passed!');
console.log('Sample results:', {
  result1: result1.substring(0, 50) + '...',
  result2: result2.substring(0, 50) + '...',
  result3: result3.substring(0, 50) + '...',
  result4: result4.substring(0, 50) + '...',
  result5: result5.substring(0, 50) + '...'
});

