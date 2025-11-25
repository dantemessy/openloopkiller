import type { Program, Statement } from 'estree';

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
 * Processes an AST and injects loop protection code
 * @param ast - The Abstract Syntax Tree (Program or Statement)
 * @param options - Configuration options
 */
declare function injectionProcess(
  ast: Program | Statement | Statement[],
  options?: InjectorOptions
): void;

export = injectionProcess;

