import 'dotenv/config'
import { assertTestMongoUrl } from './testDatabase.js'

assertTestMongoUrl(process.env.SPEC_MONGO_URL, 'SPEC_MONGO_URL', 'vegazetas_disposable')
