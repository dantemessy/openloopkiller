# Open Loop Killer

> Prevent your code from open loops by injecting protection code for any loop detected

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

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

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://npmjs.org/package/live-xxx
[travis-image]: https://img.shields.io/travis/live-js/live-xxx/master.svg
[travis-url]: https://travis-ci.org/live-js/live-xxx
[coveralls-image]: https://img.shields.io/coveralls/live-js/live-xxx/master.svg
[coveralls-url]: https://coveralls.io/r/live-js/live-xxx?branch=master