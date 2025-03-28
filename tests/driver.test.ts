import { PGlite } from '@electric-sql/pglite'
import { describe, expect, it, vi } from 'vitest'

import { PGliteConnection, PGliteDriver } from '../src/pglite-driver'

describe('kysely dialect', async () => {
  it('should create a driver instance with empty arguments', async () => {
    const driver = new PGliteDriver({})
    expect(driver).toBeInstanceOf(PGliteDriver)
  })

  it('should accept a PGlite instance', async () => {
    const driver = new PGliteDriver({ PGlite: new PGlite() })
    driver.init()

    const connection = await driver.acquireConnection()
    expect(connection).toBeInstanceOf(PGliteConnection)
    await driver.releaseConnection(connection)
  })

  it('should accept a PGlite returning promise', async () => {
    const driver = new PGliteDriver({ PGlite: async () => new PGlite() })
    await driver.init()

    const connection = await driver.acquireConnection()
    expect(connection).toBeInstanceOf(PGliteConnection)
    await driver.releaseConnection(connection)
  })

  it('should invoke connection lifecycle callbacks', async () => {
    const createSpy = vi.fn()
    const reserveSpy = vi.fn()

    const driver = new PGliteDriver({
      onCreateConnection: createSpy,
      onReserveConnection: reserveSpy,
    })
    driver.init()

    // Create a connection and release it to trigger callbacks
    const connection = await driver.acquireConnection()
    await driver.releaseConnection(connection)

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(reserveSpy).toHaveBeenCalledTimes(1)

    await driver.destroy()
  })
})
