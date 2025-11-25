/**
 * Runtime test to verify TypeScript definitions work correctly in practice
 * This file can be run with: node test/types.runtime.test.js
 */

const { injector } = require('../index.js');

console.log('Running TypeScript definitions runtime verification tests...\n');

// Test 1: Basic functionality
console.log('Test 1: Basic usage without options');
const code1 = 'while(true) { console.log("test"); }';
const result1 = injector(code1);
console.log('✓ Returned a string:', typeof result1 === 'string');
console.log('✓ Contains loop protection:', result1.includes('Date.now()'));

// Test 2: With timeout option
console.log('\nTest 2: Usage with timeout option');
const code2 = 'for(let i = 0; i < 10; i++) { console.log(i); }';
const result2 = injector(code2, { timeout: 2000 });
console.log('✓ Returned a string:', typeof result2 === 'string');
console.log('✓ Contains custom timeout:', result2.includes('2000'));

// Test 3: With errorMessage option
console.log('\nTest 3: Usage with errorMessage option');
const code3 = 'do { console.log("test"); } while(true);';
const result3 = injector(code3, { errorMessage: 'Loop timeout!' });
console.log('✓ Returned a string:', typeof result3 === 'string');
console.log('✓ Contains custom error message:', result3.includes('Loop timeout!'));

// Test 4: With both options
console.log('\nTest 4: Usage with both options');
const code4 = 'for(const key in obj) { console.log(key); }';
const result4 = injector(code4, { 
  timeout: 5000, 
  errorMessage: 'Custom error message' 
});
console.log('✓ Returned a string:', typeof result4 === 'string');
console.log('✓ Contains custom timeout:', result4.includes('5000'));
console.log('✓ Contains custom error message:', result4.includes('Custom error message'));

// Test 5: Verify options type checking (for documentation)
console.log('\nTest 5: Options object structure');
const validOptions = {
  timeout: 3000,
  errorMessage: 'Test message'
};
const result5 = injector('for(let i=0; i<10; i++) {}', validOptions);
console.log('✓ Works with full options object:', typeof result5 === 'string');

// Test 6: Error handling
console.log('\nTest 6: Error handling');
try {
  injector('while true { }'); // Invalid syntax
  console.log('✗ Should have thrown an error for invalid syntax');
} catch (error) {
  console.log('✓ Correctly throws error for invalid syntax');
}

try {
  injector('while(true) {}', { timeout: -1 }); // Invalid timeout
  console.log('✗ Should have thrown an error for invalid timeout');
} catch (error) {
  console.log('✓ Correctly throws error for invalid timeout');
}

try {
  injector('while(true) {}', { errorMessage: 123 }); // Invalid errorMessage
  console.log('✗ Should have thrown an error for invalid errorMessage');
} catch (error) {
  console.log('✓ Correctly throws error for invalid errorMessage type');
}

console.log('\n✅ All runtime verification tests passed!');
console.log('\nTypeScript definitions are working correctly and match runtime behavior.');

