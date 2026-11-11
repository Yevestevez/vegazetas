import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'
import { assertTestMongoUrl } from '../api/test/testDatabase.js'

assertTestMongoUrl(process.env.E2E_MONGO_URL, 'E2E_MONGO_URL', 'vegazetas_e2e_disposable')

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: [
    {
      command: 'node ../api/test/e2eServer.js',
      url: 'http://127.0.0.1:32123/health',
      reuseExistingServer: false
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      env: { VITE_API_URL: 'http://127.0.0.1:32123' }
    }
  ]
})
