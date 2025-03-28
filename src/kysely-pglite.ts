import {
  PGlite,
  PGliteInterfaceExtensions,
  type PGliteOptions,
} from '@electric-sql/pglite'
import { isObject, isString } from '@sindresorhus/is'
import fs from 'fs-extra'
import { type Dialect } from 'kysely'
import { PGliteDialect } from './pglite-dialect.js'

export class KyselyPGlite<O extends PGliteOptions = PGliteOptions> {
  client!: PGlite & PGliteInterfaceExtensions<O['extensions']>

  /**
   * Create a new KyselyPGlite instance.
   * @param options `PGliteOptions` or `PGlite
   */
  constructor(options?: PGlite | O) {
    if (options?.dataDir && isString(options.dataDir)) {
      fs.ensureDirSync(options.dataDir)
    }

    if (isObject(options) && options instanceof PGlite) {
      // @ts-expect-error
      this.client = options
      return
    }

    // @ts-expect-error
    this.client = new PGlite(options)
  }

  static async create<O extends PGliteOptions>(
    options?: PGlite | O,
  ): Promise<KyselyPGlite<O>> {
    const pg = await PGlite.create(options)
    return new KyselyPGlite<O>(pg) as any
  }

  get dialect(): Dialect {
    return new PGliteDialect({})
  }
}
