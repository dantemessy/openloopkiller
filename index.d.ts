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
 * Injects loop protection code into JavaScript source code
 * @param code - The JavaScript code to protect
 * @param options - Configuration options for timeout and error message
 * @returns The protected JavaScript code with timeout checks injected
 * @throws {Error} If code fails to parse or if options are invalid
 * 
 * @example
 * ```typescript
 * import { injector } from 'open-loop-killer';
 * 
 * const code = 'while(true) { console.log("test"); }';
 * const protectedCode = injector(code, { timeout: 2000 });
 * ```
 */
export function injector(code: string, options?: InjectorOptions): string;

