<div align="center">
  <img src="logo.jpg" alt="Open Loop Killer Logo" width="280"/>
  
  # Open Loop Killer
  
  **Protect your JavaScript code from infinite loops**
  
  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  
  *Inject timeout protection into all loop types • Customizable • Production-ready*
</div>

---

## Install

```
npm i open-loop-killer
```

## Usage

- Runs Untrusted code securely with no open loops issue.
- Add one more layer of safety for your code.
- Protects `while`, `for`, `do-while`, `for...in`, and `for...of` loops from running indefinitely.

## How does it work

1. Parses the code to make sure it's valid JavaScript.
2. Converts it to AST (Abstract Syntax Tree).
3. Detects all loops and injects protection code.
4. Converts AST back to executable JavaScript string.

## API

### `injector(code, options)`

Injects loop protection code into JavaScript source code.

#### Parameters

- **`code`** (string, required) - The JavaScript code to protect
- **`options`** (object, optional) - Configuration options
  - **`timeout`** (number, optional) - Timeout in milliseconds before throwing error. Default: `1000`
  - **`errorMessage`** (string, optional) - Custom error message. Default: `'Open Loop Detected!'`

#### Returns

- (string) - The protected JavaScript code with injected loop protection

#### Throws

- Error if code is invalid JavaScript
- Error if options are invalid

## Examples

### Basic Usage

```javascript
const {injector} = require('open-loop-killer');

let code = `
    while(true){
    }
`
let injectedCode = injector(code);
```

### With Custom Timeout

```javascript
const {injector} = require('open-loop-killer');

let code = `
    for(let i = 0; i < 1000000; i++){
        // Some operation
    }
`
let injectedCode = injector(code, {
    timeout: 5000  // 5 seconds
});
```

### With Custom Error Message

```javascript
const {injector} = require('open-loop-killer');

let code = `
    while(true){
    }
`
let injectedCode = injector(code, {
    errorMessage: 'Loop execution timeout exceeded!'
});
```

### With Both Options

```javascript
const {injector} = require('open-loop-killer');

let injectedCode = injector(code, {
    timeout: 2000,
    errorMessage: 'Custom timeout message'
});
```

### Injected Code Example

Input:
```javascript
while(true) { }
```

Output:
```javascript
let _a3f9b2 = Date.now();
while (true) {
    if (Date.now() - _a3f9b2 > 1000) {
        throw new Error('Open Loop Detected!');
    }
    {
    }
}
```

## Supported Loop Types

✅ **Fully Protected:**
- `while` loops
- `for` loops
- `do-while` loops
- `for...in` loops
- `for...of` loops

## Limitations

⚠️ **Important**: This package has the following limitations:

1. **No protection (not yet supported) for:**
   - ❌ `for await...of` loops (async iteration)
   - ❌ Recursive functions
   - ❌ Async loops or promises without await
   - ❌ Array methods like `.forEach()`, `.map()`, etc.

2. **Timeout behavior:**
   - Timeout is checked on each iteration
   - If a single iteration takes longer than the timeout, it won't be caught
   - Protection works best for loops with many fast iterations
   - For `for...in` and `for...of`, protection works on iteration count, not property/item count

3. **Error handling:**
   - When a loop times out, it throws an error
   - Make sure to wrap execution in try-catch if needed


## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/open-loop-killer.svg
[npm-url]: https://www.npmjs.com/package/open-loop-killer

[downloads-image]: https://img.shields.io/npm/dm/open-loop-killer.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/open-loop-killer

