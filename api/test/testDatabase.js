export const assertTestMongoUrl = (uri, variableName, databaseName) => {
    if (!uri) throw new Error(`${variableName} must point to a disposable local database`)

    let url
    try {
        url = new URL(uri)
    } catch {
        throw new Error(`${variableName} must be a valid MongoDB URI`)
    }

    if (url.protocol !== 'mongodb:' || url.hostname !== '127.0.0.1' || !url.port ||
        url.pathname !== `/${databaseName}` || url.username || url.password || url.search || url.hash) {
        throw new Error(`${variableName} must point to the documented disposable local database`)
    }
}
