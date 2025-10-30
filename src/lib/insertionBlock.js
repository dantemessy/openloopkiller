'use strict'

const parseScript = require('esprima').parseScript;

module.exports = (options = {}) => {
    // Default options
    const timeout = options.timeout || 1000;
    const errorMessage = options.errorMessage || 'Open Loop Detected!';

    // Placeholder variable name - will be replaced with unique random name by blockInjection.js
    // This prevents naming conflicts with user's code
    const PLACEHOLDER_VAR = 'LOOP_START_TIME';

    // Create AST for: let LOOP_START_TIME = Date.now();
    const timerDeclaration = parseScript(`let ${PLACEHOLDER_VAR} = Date.now();`);
    
    // Create AST for: if (Date.now() - LOOP_START_TIME > timeout) { throw new Error(...) }
    // NOTE: The while(a) is just a wrapper to make the code parseable by esprima.
    // We only extract the 'if' statement from inside - the while loop is discarded.
    // This is necessary because esprima can't parse a standalone 'if' statement.

    const timeoutCheck = parseScript(
        `while(a){if (Date.now() - ${PLACEHOLDER_VAR} > ${timeout}) { throw new Error("${errorMessage}");}}`);
        
    const insertionBlocks = {
      before: timerDeclaration.body[0],        // Variable declaration to insert before loop
      inside: timeoutCheck.body[0].body.body[0], // If statement to insert inside loop
    };
  
    return insertionBlocks;
  };