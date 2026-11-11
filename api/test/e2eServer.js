import mongoose from 'mongoose'
import createApp from '../app.js'
import { assertTestMongoUrl } from './testDatabase.js'

assertTestMongoUrl(process.env.E2E_MONGO_URL, 'E2E_MONGO_URL', 'vegazetas_e2e_disposable')
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'local-disposable-test-secret'

await mongoose.connect(process.env.E2E_MONGO_URL, { directConnection: true })

await new Promise((resolve, reject) => {
    const server = createApp().listen(32123, '127.0.0.1', resolve)
    server.once('error', reject)
})
