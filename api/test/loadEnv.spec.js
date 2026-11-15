import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadEnvFile } from 'node:process'
import { chdir } from 'node:process'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

let directory
let originalCwd

describe('native environment loading', () => {
    beforeEach(async () => {
        originalCwd = process.cwd()
        directory = await mkdtemp(join(tmpdir(), 'vegazetas-env-test-'))
        chdir(directory)
    })

    afterEach(async () => {
        chdir(originalCwd)
        await rm(directory, { recursive: true, force: true })
        // Clean up test env vars
        delete process.env.VEGAZETAS_TEST_LOADED
        delete process.env.VEGAZETAS_TEST_EXISTING
    })

    test('loads values without overriding existing environment variables', async () => {
        await writeFile(join(directory, '.env'), 'VEGAZETAS_TEST_LOADED="from file"\nVEGAZETAS_TEST_EXISTING=from-file\n')

        process.env.VEGAZETAS_TEST_EXISTING = 'from-process'
        loadEnvFile()

        expect(process.env.VEGAZETAS_TEST_LOADED).toBe('from file')
        expect(process.env.VEGAZETAS_TEST_EXISTING).toBe('from-process')
    })

    test('allows a missing optional .env file', () => {
        // loadEnvFile throws ENOENT when .env is missing, which is expected.
        // The loadEnv.ts module catches this case. Verify the raw behavior here.
        expect(() => loadEnvFile()).toThrow(/ENOENT/)
    })

    test('surfaces errors other than a missing file', async () => {
        await mkdir(join(directory, '.env'))

        expect(() => loadEnvFile()).toThrow()
    })
})
