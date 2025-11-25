import type { VariableDeclaration, IfStatement } from 'estree';

/**
 * Options for configuring loop protection behavior
 */
export interface InjectorOptions {
  /**
   * Timeout in milliseconds before throwing error
   * @default 1000
   */
  timeout?: number;
  
  /**
   * Custom error message to throw when loop timeout is detected
   * @default 'Open Loop Detected!'
   */
  errorMessage?: string;
}

/**
 * Block of code to be inserted for loop protection
 */
export interface InsertionBlocks {
  /**
   * Variable declaration to insert before the loop
   * e.g., let LOOP_START_TIME = Date.now();
   */
  before: VariableDeclaration;
  
  /**
   * If statement to insert inside the loop body
   * e.g., if (Date.now() - LOOP_START_TIME > timeout) { throw new Error(...) }
   */
  inside: IfStatement;
}

/**
 * Generates AST nodes for loop protection code
 * @param options - Configuration options
 * @returns Object containing AST nodes to be inserted before and inside loops
 */
declare function insertionCode(options?: InjectorOptions): InsertionBlocks;

export = insertionCode;

