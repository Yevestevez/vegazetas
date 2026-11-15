import { loadEnvFile } from 'node:process'

try {
    loadEnvFile()
} catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code !== 'ENOENT') throw error
}
