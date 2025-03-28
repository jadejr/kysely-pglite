import { isString } from '@sindresorhus/is'
import fs from 'fs-extra'
import {
  type DatabaseIntrospector,
  type Dialect,
  type DialectAdapter,
  type Driver,
  type Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type QueryCompiler,
} from 'kysely'
import { PGliteDialectConfig } from './pglite-dialect-config.js'
import { PGliteDriver } from './pglite-driver.js'

/**
 *
 * PGlite dialect that uses the [@electric-sql/pglite](https://pglite.dev) library.
 *
 * The constructor takes an instance of {@link PGliteDialectConfig}.
 *
 * ```ts
 * import { PGlite } from '@electric-sql/pglite'
 * import { PGliteDialect } from 'kysely-pglite'
 *
 * new PGliteDialect({
 *   PGlite: new PGlite({
 *     'dataDir': '/path/to/dataDir',
 *    // other options
 *   })
 * })
 * ```
 *
 * If you want PGlite to only be created once it's first used, `PGlite`
 * can be a function:
 *
 * The constructor takes an instance of {@link PGliteDialectConfig}.
 *
 * ```ts
 * import { PGlite } from '@electric-sql/pglite'
 * import { PGliteDialect } from 'kysely-pglite'
 *
 * new PGliteDialect({
 *   PGlite: async () => new PGlite({
 *     'dataDir: '/path/to/dataDir',
 *    // other options
 *   })
 * })
 * ```
 *
 * You can also let the dialect create the PGlite instance for you while using PGlite's options
 *
 * ```ts
 * new PGliteDialect({
 *   PGliteOptions: {
 *     'dataDir: '/path/to/dataDir',
 *    // other options
 *   }
 * })
 * ```
 */
export class PGliteDialect implements Dialect {
  readonly #config: PGliteDialectConfig

  constructor(config: PGliteDialectConfig) {
    this.#config = config

    const options = config.PGliteOptions
    if (options?.dataDir && isString(options.dataDir)) {
      fs.ensureDirSync(options.dataDir)
    }
  }

  createDriver(): Driver {
    return new PGliteDriver(this.#config)
  }

  createQueryCompiler(): QueryCompiler {
    return new PostgresQueryCompiler()
  }

  createAdapter(): DialectAdapter {
    return new PostgresAdapter()
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new PostgresIntrospector(db)
  }
}
