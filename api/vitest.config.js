import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify('http://127.0.0.1:32123')
    },
    test: {
        include: mode === 'ethereal'
            ? ['test/passwordRecover.ethereal.spec.js']
            : ['test/*.spec.js'],
        fileParallelism: false,
        setupFiles: ['test/setup.js'],
        coverage: {
            reporter: ['text', 'html']
        }
    }
}))
