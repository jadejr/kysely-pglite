import consola from 'consola'
import { Logger, getLogLevelNumber } from 'kysely-codegen'

export const enum LogLevel {
  SILENT = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  DEBUG = 4,
}

export class CodegenLogger extends Logger {
  debug(...values: [unknown, unknown]) {
    if (getLogLevelNumber(this.logLevel) >= LogLevel.DEBUG) {
      consola.debug(...values)
    }
  }

  error(...values: [unknown, unknown]) {
    if (getLogLevelNumber(this.logLevel) >= LogLevel.ERROR) {
      consola.error(...values)
    }
  }

  info(...values: [unknown, unknown]) {
    if (getLogLevelNumber(this.logLevel) >= LogLevel.INFO) {
      consola.info(...values)
    }
  }

  log(...values: [unknown, unknown]): void {
    if (getLogLevelNumber(this.logLevel) >= LogLevel.INFO) {
      consola.log(...values)
    }
  }
}
