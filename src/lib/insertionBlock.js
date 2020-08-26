'use strict'

const parseScript = require('esprima').parseScript;
// import {parseScript} from "esprima"

module.exports = () => {

    const ast1 = parseScript('let tempName = Date.now();');
    const ast2 = parseScript('while(a){if (Date.now() - tempName > 1000) { throw new Error("Open Loop Detected!");}}');
        
    const insertionBlocks = {
      before: ast1.body[0],
      inside: ast2.body[0].body.body[0],
    };
  
    return insertionBlocks;
  };