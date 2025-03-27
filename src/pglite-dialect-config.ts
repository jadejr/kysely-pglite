import { type PGlite } from '@electric-sql/pglite'

export interface PGliteDialectConfig {
  /**
   * A PGlite instance or a function that returns one.
   *
   * If a function is provided, it's called once when the first query is executed.
   */
  PGlite: PGlite | (() => Promise<PGlite>)
}
