'use strict'


// module.exports = require('./src/lib/main.js')
const test = require('./src/lib/main.js');

let code = `
    while(true){
    }
`

console.log(test(code));
