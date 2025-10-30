'use strict';

const parseScript = require('esprima').parseScript;
const generate = require('escodegen').generate;
const injectionProcess = require('./blockInjection.js');




module.exports = (code) => {

    let data;

    // Parse and validate the script using esprima
    try {
        data = parseScript(code);
    } catch (err) {
        throw new Error('Failed to parse script due to: ' + err);
    }

    try {
        injectionProcess(data);
    } catch (err) {
        throw new Error('Failed to inject loop protection due to: ' + err);
    }

    try {
        data = generate(data);

    } catch (err) {
        throw new Error('Failed to generate script from AST due to: ' + err);
    }

    return data;
};