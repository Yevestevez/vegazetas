import 'dotenv/config'

const uri = process.env.SPEC_MONGO_URL
if (!uri) throw new Error('SPEC_MONGO_URL must point to a disposable local database')

let url
try {
    url = new URL(uri)
} catch {
    throw new Error('SPEC_MONGO_URL must be a valid MongoDB URI')
}

if (url.protocol !== 'mongodb:' || url.hostname !== '127.0.0.1' || !url.port ||
    url.pathname !== '/vegazetas_disposable' || url.username || url.password || url.search || url.hash) {
    throw new Error('SPEC_MONGO_URL must point to the documented disposable local database')
}
