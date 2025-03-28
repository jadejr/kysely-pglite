import { type PGlite, type PGliteOptions } from '@electric-sql/pglite'
import { type DatabaseConnection } from 'kysely'

type PGliteOrPromise = PGlite | ((options?: PGliteOptions) => Promise<PGlite>)

export interface PGliteDialectConfig {
  /**
   * The options to pass to the PGlite instance.
   */
  PGliteOptions?: PGliteOptions
  /**
   * A PGlite instance or a function that returns one.
   *
   * If a function is provided, it's called once when the first query is executed.
   */
  PGlite?: PGliteOrPromise
}
