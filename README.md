# Open Loop Killer

> Prevent your code from open loops by injecting protection code for any loop detected

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Install

```
npm i open-loop-killer
```

## Usage

- Runs Untrusted code securely with no open loops issue.
- Add one more layer of safety for your code.


## How does it work

- Compile the code to make sure it valid.
- Convert it to AST.
- Find any loop to inject the protection code to it.
- Convert AST to String.


## Example 
```
const {injector} = require('open-loop-killer');

let code = `
    while(true){
    }
`
let injectedCode = injector(code));

```

Injected Code Be Like: 
```
let _9ui = Date.now();
while (true) {
    if (Date.now() - _9ui > 1000) {
        throw new Error('Open Loop Detected!');
    }
    {
    }
}

```



## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/open-loop-killer.svg
[npm-url]: https://www.npmjs.com/package/open-loop-killer

[downloads-image]: https://img.shields.io/npm/dm/open-loop-killer.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/open-loop-killer

