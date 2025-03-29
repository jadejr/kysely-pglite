import { basename, resolve } from 'node:path'
import { createJiti } from 'jiti'
import { Kysely, Migrator, type Migration } from 'kysely'
import { all, objectify } from 'radash'
import { glob } from 'tinyglobby'

const jiti = createJiti(import.meta.filename, {
  // prevent files from getting cached so the `watch` feature works.
  moduleCache: false,
})

export function createMigrator(db: Kysely<any>, migrationsPath: string) {
  const path = resolve(migrationsPath)
  return new Migrator({
    db,
    provider: {
      async getMigrations() {
        const files = await glob('**/*.{js,ts}', {
          cwd: path,
          expandDirectories: true,
          ignore: ['**/types.ts', '**/*.d.ts'],
          absolute: true,
        })

        const migrations = objectify(
          files,
          (f) => basename(f),
          (f) => jiti.import(f),
        )

        // TODO: improve validating imported functions
        const modules = (await all(migrations)) as Record<string, Migration>
        return modules
      },
    },
  })
}
