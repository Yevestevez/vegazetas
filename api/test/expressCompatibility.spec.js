import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import createApp from '../app.js'

describe('JSON request compatibility', () => {
    let server
    let url

    beforeAll(async () => {
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
        url = `http://127.0.0.1:${server.address().port}/users/auth`
    })

    test.each([
        ['missing body', {}],
        ['non-JSON body', { headers: { 'Content-Type': 'text/plain' }, body: 'hello' }],
        ['empty JSON body', { headers: { 'Content-Type': 'application/json' }, body: '' }]
    ])('preserves validation for a %s', async (_description, options) => {
        const response = await fetch(url, { method: 'POST', ...options })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid email type, must be a string'
        })
    })

    test('parses JSON before validating it', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'not-an-email' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid email syntax'
        })
    })

    test('forwards malformed JSON to the error handler', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{'
        })

        expect(response.status).toBe(500)
        expect((await response.json()).error).toBe('SystemError')
    })

    afterAll(async () => {
        if (server) {
            await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
        }
    })
})
