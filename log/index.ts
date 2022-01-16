/**
 * A utility function that logs a debug message.
 *
 * @param message
 */
export function logMessage(message: string): void {
  console.log(`\x1b[90m[env]: ${message}\x1b[0m`);
}

/**
 * A utility function that logs a warning message.
 *
 * @param message
 */
export function logWarning(message: string): void {
  console.log(`\x1b[33m[env]: ${message}\x1b[0m`);
}

/**
 * A utility function that logs an error message.
 *
 * @param message
 * @throws an error message
 */
export function logError(message: string): void {
  throw String(`\x1b[41m[env]: ${message}\x1b[0m`);
}
