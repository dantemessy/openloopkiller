'use strict';

const parseScript = require('esprima').parseScript;
const generate = require('escodegen').generate;
const injectionProcess = require('./blockInjection.js');
const { VMScript } = require('vm2');




module.exports = (code) => {

    let data;
    let vm = new VMScript(code);

    try {
        vm.compile();
        console.log("vm")
    } catch (err) {
        throw new Error('Failed to compile script due to: ' + err);
    }

    try {
        data = parseScript(code);
        console.log("parseScript")
    } catch (err) {
        throw new Error('Failed to parse script due to: ' + err);
    }

    try {
        injectionProcess(data);
        console.log("injectionProcess")
    } catch (err) {
        throw new Error('Failed to inject loop protection due to: ' + err);
    }

    try {
        data = generate(data);
        console.log("data")

    } catch (err) {
        throw new Error('Failed to generate script from AST due to: ' + err);
    }

    return data;
};