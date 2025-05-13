/**
 * info log when in dev, otherwise supress log
 */
export function log(...params: any[]) {
  console.info(`[Mindfully]`, ...params)
}

/**
 * error log when in dev, otherwise supress log
 */
export function logError(...params: any): void {
  console.error(...params)
}
