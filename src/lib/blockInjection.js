'use strict';

const randomIdGenerator = require('../util/idGenerator.js');
const insertionCode = require('./insertionBlock');



const injectionProcess = (ast) => {
    
  // If this isn't actual body, recurse with the body
  if (!Array.isArray(ast)) {
    injectionProcess(ast.body);
    return;
  }
  // Traverse the body
  for (let i = ast.length; i--;) {

    const currentElement = ast[i];
    const loopDetected = (currentElement && currentElement.type === 'ForStatement') ||
    currentElement.type === 'WhileStatement' ||
    currentElement.type === 'DoWhileStatement'; 

    
    if (loopDetected){
      const insertionBlocks = insertionCode();
      const randomVariableName = randomIdGenerator();
      //@ts-ignore
      insertionBlocks.before.declarations[0].id.name = insertionBlocks.inside.test.left.right.name = randomVariableName;

      // Insert time variable assignment as first child in the body array.
      ast.splice(i, 0, insertionBlocks.before);

      // If the loop's body is a single statement, then convert it into a block statement
      // so that we can insert our conditional break inside it.
      if (!Array.isArray(currentElement.body)) {
        currentElement.body = {
          body: [currentElement.body],
          type: 'BlockStatement',
        };
      }

      // Insert the `If` Statement check
      currentElement.body.body.unshift(insertionBlocks.inside);
    }

    // Recurse on inner body
    if (currentElement.body) {
      injectionProcess(currentElement.body);
    }
  }
};

module.exports = injectionProcess;