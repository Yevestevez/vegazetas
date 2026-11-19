import '../config/loadEnv.ts'
import { assertTestMongoUrl } from './testDatabase.js'

if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = 'http://127.0.0.1:5173'
}

assertTestMongoUrl(process.env.SPEC_MONGO_URL, 'SPEC_MONGO_URL', 'vegazetas_disposable')
