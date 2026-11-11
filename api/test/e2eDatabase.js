import mongoose from 'mongoose'
import { User } from '../data/models.js'
import { assertTestMongoUrl } from './testDatabase.js'

export const removeE2eUser = async email => {
    assertTestMongoUrl(process.env.E2E_MONGO_URL, 'E2E_MONGO_URL', 'vegazetas_e2e_disposable')
    if (!/^e2e-[a-f0-9-]+@example\.invalid$/.test(email)) {
        throw new Error('Refusing to delete an unexpected test user')
    }

    try {
        await mongoose.connect(process.env.E2E_MONGO_URL, { directConnection: true })
        await User.deleteOne({ email })
    } finally {
        await mongoose.disconnect()
    }
}
