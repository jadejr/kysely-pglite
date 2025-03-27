import type { Dialect } from 'kysely'
import { PostgresAdapter, type GenerateOptions, generate } from 'kysely-codegen'
import { KyselyPGliteIntrospector } from './introspector.js'

export class Codegen {
  constructor(public dialect: Dialect) {}

  async generate(opts: Omit<GenerateOptions, 'dialect'>) {
    return await generate({
      ...opts,
      dialect: {
        adapter: new PostgresAdapter(),
        introspector: new KyselyPGliteIntrospector(),
        createKyselyDialect: async () => {
          return this.dialect
        },
      },
    })
  }
}
