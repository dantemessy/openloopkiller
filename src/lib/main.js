'use strict';

const parseScript = require('esprima').parseScript;
const generate = require('escodegen').generate;
const injectionProcess = require('./blockInjection.js');

/**
 * Injects loop protection code into JavaScript source code
 * @param {string} code - The JavaScript code to protect
 * @param {Object} options - Configuration options
 * @param {number} [options.timeout=1000] - Timeout in milliseconds before throwing error
 * @param {string} [options.errorMessage='Open Loop Detected!'] - Custom error message
 * @returns {string} - The protected JavaScript code
 */
module.exports = (code, options = {}) => {

    let data;

    // Step 1: Validate user options
    // Ensure timeout is a positive number if provided
    if (options.timeout !== undefined && (typeof options.timeout !== 'number' || options.timeout <= 0)) {
        throw new Error('options.timeout must be a positive number');
    }

    // Ensure errorMessage is a string if provided
    if (options.errorMessage !== undefined && typeof options.errorMessage !== 'string') {
        throw new Error('options.errorMessage must be a string');
    }

    // Step 2: Parse JavaScript code into AST (Abstract Syntax Tree)
    // This validates syntax and creates a tree structure we can modify
    try {
        data = parseScript(code);
    } catch (err) {
        throw new Error('Failed to parse script due to: ' + err);
    }

    // Step 3: Traverse AST and inject timeout protection into all loops
    // This modifies the AST in-place, adding timer checks to each loop
    try {
        injectionProcess(data, options);
    } catch (err) {
        throw new Error('Failed to inject loop protection due to: ' + err);
    }

    // Step 4: Convert modified AST back to JavaScript code string
    // The result is executable JavaScript with protection injected
    try {
        data = generate(data);
    } catch (err) {
        throw new Error('Failed to generate script from AST due to: ' + err);
    }

    // Step 5: Return the protected code
    return data;
};