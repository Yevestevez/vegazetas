import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

const loaderUrl = new URL('../config/loadEnv.js', import.meta.url).href
let directory

const runLoader = (environment = {}) => {
    const result = spawnSync(process.execPath, [
        '--input-type=module',
        '-e',
        `await import(${JSON.stringify(loaderUrl)}); process.stdout.write(JSON.stringify({
            loaded: process.env.VEGAZETAS_TEST_LOADED,
            existing: process.env.VEGAZETAS_TEST_EXISTING
        }))`
    ], {
        cwd: directory,
        env: {
            ...process.env,
            VEGAZETAS_TEST_LOADED: '',
            VEGAZETAS_TEST_EXISTING: '',
            ...environment
        },
        encoding: 'utf8'
    })
    if (result.error) throw result.error
    return result
}

describe('native environment loading', () => {
    beforeEach(async () => {
        directory = await mkdtemp(join(tmpdir(), 'vegazetas-env-test-'))
    })

    afterEach(async () => {
        await rm(directory, { recursive: true, force: true })
    })

    test('loads values without overriding existing environment variables', async () => {
        await writeFile(join(directory, '.env'), 'VEGAZETAS_TEST_LOADED="from file"\nVEGAZETAS_TEST_EXISTING=from-file\n')

        const result = runLoader({ VEGAZETAS_TEST_LOADED: undefined, VEGAZETAS_TEST_EXISTING: 'from-process' })

        expect(result.status).toBe(0)
        expect(JSON.parse(result.stdout)).toEqual({ loaded: 'from file', existing: 'from-process' })
    })

    test('allows a missing optional .env file', () => {
        const result = runLoader()

        expect(result.status).toBe(0)
    })

    test('surfaces errors other than a missing file', async () => {
        await mkdir(join(directory, '.env'))

        const result = runLoader()

        expect(result.status).not.toBe(0)
        expect(result.stderr).toContain('.env')
    })
})
