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
 * @param options - Configuration options
 * @returns The protected JavaScript code
 * @throws {Error} If code fails to parse or if options are invalid
 */
declare function injector(code: string, options?: InjectorOptions): string;

export = injector;

