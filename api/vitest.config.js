import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
    test: {
        include: mode === 'ethereal'
            ? ['test/passwordRecover.ethereal.spec.js']
            : ['logic/*.spec.js', 'test/toggleFavoriteRecipe.spec.js'],
        fileParallelism: false,
        setupFiles: ['test/setup.js'],
        coverage: {
            reporter: ['text', 'html']
        }
    }
}))
