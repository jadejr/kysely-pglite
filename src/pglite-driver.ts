import { PGlite } from '@electric-sql/pglite'
import { isFunction } from '@sindresorhus/is'
import {
  CompiledQuery,
  type DatabaseConnection,
  type QueryResult,
  type TransactionSettings,
} from 'kysely'

import { PGliteDialectConfig } from './pglite-dialect-config.js'

export class PGliteDriver {
  readonly #config: PGliteDialectConfig
  #client!: PGlite

  constructor(config: PGliteDialectConfig) {
    this.#config = config
  }

  async init(): Promise<void> {
    if (this.#config.PGlite instanceof PGlite) {
      this.#client = this.#config.PGlite
      return
    }
    if (isFunction(this.#config.PGlite)) {
      this.#client = await this.#config.PGlite(this.#config.PGliteOptions)
      return
    }
    this.#client = new PGlite(this.#config.PGliteOptions)
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    if (!this.#client) {
      throw new Error(
        'PGlite client is not initialized. init() must be called first.',
      )
    }
    const connection = new PGliteConnection(this.#client)

    if (this.#config.onCreateConnection) {
      await this.#config.onCreateConnection(connection)
    }
    if (this.#config.onReserveConnection) {
      await this.#config.onReserveConnection(connection)
    }

    return connection
  }

  async beginTransaction(
    connection: DatabaseConnection,
    _settings: TransactionSettings,
  ): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('BEGIN'))
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('COMMIT'))
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('ROLLBACK'))
  }

  async destroy(): Promise<void> {
    await this.#client.close()
  }

  async releaseConnection(_connection: DatabaseConnection): Promise<void> {}
}

export class PGliteConnection implements DatabaseConnection {
  #client: PGlite

  constructor(client: PGlite) {
    this.#client = client
  }

  async executeQuery<R>(
    compiledQuery: CompiledQuery<any>,
  ): Promise<QueryResult<R>> {
    return await this.#client.query<R>(compiledQuery.sql, [
      ...compiledQuery.parameters,
    ])
  }

  async *streamQuery(): AsyncGenerator<never, void, unknown> {
    throw new Error('PGlite does not support streaming.')
  }
}
