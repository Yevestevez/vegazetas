import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
    test: {
        include: mode === 'ethereal'
            ? ['test/passwordRecover.ethereal.spec.js']
            : ['logic/*.spec.js', 'test/toggleFavoriteRecipe.spec.js', 'test/getUserName.spec.js', 'test/expressCompatibility.spec.js', 'test/loadEnv.spec.js', 'test/validateTag.spec.js', 'test/validateRecipeFields.spec.js', 'test/validateIngredientFields.spec.js', 'test/validateName.spec.js', 'test/validateUsername.spec.js', 'test/validateEmail.spec.js', 'test/validatePassword.spec.js', 'test/validateId.spec.js', 'test/validateIndex.spec.js'],
        fileParallelism: false,
        setupFiles: ['test/setup.js'],
        coverage: {
            reporter: ['text', 'html']
        }
    }
}))
