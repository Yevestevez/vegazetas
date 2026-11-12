import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import {
    descriptionSchema, difficultySchema, errors, imageSchema, noteSchema,
    stepNoteUpdateSchema, textSchema, timeSchema, titleSchema, validate
} from 'com'
import createApp from '../app.js'
import { Recipe, User } from '../data/models.js'
import addImageToRecipe from '../logic/addImageToRecipe.js'
import addStepToRecipe from '../logic/addStepToRecipe.js'
import createRecipe from '../logic/createRecipe.js'
import updateRecipe from '../logic/updateRecipe.js'
import updateStep from '../logic/updateStep.js'
import addImageInApp from '../../app/src/logic/addImageToRecipe.js'
import addStepInApp from '../../app/src/logic/addStepToRecipe.js'
import createRecipeInApp from '../../app/src/logic/createRecipe.js'
import updateRecipeInApp from '../../app/src/logic/updateRecipe.js'
import updateStepInApp from '../../app/src/logic/updateStep.js'

describe('shared recipe field validation', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    test.each(['a', 'x'.repeat(50), '  ', '🍎'.repeat(25)])('accepts a title without changing it', title => {
        expect(titleSchema.parse(title)).toBe(title)
        expect(validate.title(title)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid title type, must be a string'],
        [null, 'invalid title type, must be a string'],
        [5, 'invalid title type, must be a string'],
        ['', 'invalid title length, must be between 1 and 50 characters'],
        ['🍎'.repeat(26), 'invalid title length, must be between 1 and 50 characters']
    ])('rejects invalid title %s with its existing error', (title, message) => {
        expect(titleSchema.safeParse(title).success).toBe(false)
        expect(() => validate.title(title)).toThrowError(errors.ValidationError)
        expect(() => validate.title(title)).toThrowError(message)
    })

    test.each(['', 'x'.repeat(500), '🍎'.repeat(250)])('accepts a description without changing it', description => {
        expect(descriptionSchema.parse(description)).toBe(description)
        expect(validate.description(description)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid description type, must be a string'],
        [null, 'invalid description type, must be a string'],
        [5, 'invalid description type, must be a string'],
        ['x'.repeat(501), 'invalid description length, must be 500 characters maximum'],
        ['🍎'.repeat(251), 'invalid description length, must be 500 characters maximum']
    ])('rejects invalid description %s with its existing error', (description, message) => {
        expect(descriptionSchema.safeParse(description).success).toBe(false)
        expect(() => validate.description(description)).toThrowError(errors.ValidationError)
        expect(() => validate.description(description)).toThrowError(message)
    })

    test.each([
        ['', undefined, 'invalid title length, must be between 1 and 50 characters'],
        ['valid', 'x'.repeat(501), 'invalid description length, must be 500 characters maximum']
    ])('rejects invalid recipe fields in creation and editing before I/O', (title, description, message) => {
        const id = 'a'.repeat(24)
        expect(() => createRecipe(id, title, undefined, description)).toThrowError(message)
        expect(() => updateRecipe(id, id, title, description)).toThrowError(message)
        expect(() => createRecipeInApp(id, title, undefined, description)).toThrowError(message)
        expect(() => updateRecipeInApp(id, title, description)).toThrowError(message)
    })

    test.each(['http://example.test/a', 'HTTPS://example.test/image', 'http://ab'])('accepts an image URL without changing it', image => {
        expect(imageSchema.parse(image)).toBe(image)
        expect(validate.image(image)).toBeUndefined()
    })

    test.each([
        [null, 'invalid image type, must be a string'],
        [42, 'invalid image type, must be a string'],
        ['', 'invalid image syntax, must be a valid URL'],
        ['ftp://example.test/image', 'invalid image syntax, must be a valid URL'],
        ['https://example.test/has space', 'invalid image syntax, must be a valid URL'],
        ['http://a', 'invalid image syntax, must be a valid URL']
    ])('rejects invalid image %s with its existing error', (image, message) => {
        expect(imageSchema.safeParse(image).success).toBe(false)
        expect(() => validate.image(image)).toThrowError(errors.ValidationError)
        expect(() => validate.image(image)).toThrowError(message)
    })

    test('rejects invalid image URLs in the API and frontend before I/O', () => {
        const id = 'a'.repeat(24)
        const message = 'invalid image syntax, must be a valid URL'
        expect(() => addImageToRecipe(id, id, 'not a URL')).toThrowError(message)
        expect(() => addImageInApp(id, 'not a URL')).toThrowError(message)
    })

    test.each(['easy', 'medium', 'difficult'])('accepts the existing difficulty %s', difficulty => {
        expect(difficultySchema.parse(difficulty)).toBe(difficulty)
        expect(validate.difficulty(difficulty)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid difficulty type, must be a string'],
        [false, 'invalid difficulty type, must be a string'],
        ['', 'invalid difficulty (must be easy, medium or difficult)'],
        ['Easy', 'invalid difficulty (must be easy, medium or difficult)'],
        ['hard', 'invalid difficulty (must be easy, medium or difficult)']
    ])('rejects invalid difficulty %s with its existing error', (difficulty, message) => {
        expect(difficultySchema.safeParse(difficulty).success).toBe(false)
        expect(() => validate.difficulty(difficulty)).toThrowError(errors.ValidationError)
        expect(() => validate.difficulty(difficulty)).toThrowError(message)
    })

    test('rejects an invalid difficulty in creation and editing before I/O', () => {
        const id = 'a'.repeat(24)
        const message = 'invalid difficulty (must be easy, medium or difficult)'
        expect(() => createRecipe(id, 'valid', undefined, undefined, undefined, 'hard')).toThrowError(message)
        expect(() => updateRecipe(id, id, 'valid', undefined, undefined, 'hard')).toThrowError(message)
        expect(() => createRecipeInApp(id, 'valid', undefined, undefined, undefined, 'hard')).toThrowError(message)
        expect(() => updateRecipeInApp(id, 'valid', undefined, undefined, 'hard')).toThrowError(message)
    })

    test('preserves the existing handling of an empty optional difficulty', async () => {
        const id = 'a'.repeat(24)
        const findUser = vi.spyOn(User, 'findById').mockResolvedValue(null)
        vi.stubGlobal('sessionStorage', { token: 'test-token' })
        const fetchMock = vi.fn((_url, options) => Promise.resolve({
            status: options.method === 'POST' ? 201 : 204,
            json: async () => 'recipe-id'
        }))
        vi.stubGlobal('fetch', fetchMock)

        await expect(createRecipe(id, 'valid', undefined, undefined, undefined, '')).rejects.toThrow('user not found')
        await expect(updateRecipe(id, id, 'valid', undefined, undefined, '')).rejects.toThrow('user not found')
        await createRecipeInApp(id, 'valid', undefined, undefined, undefined, '')
        await updateRecipeInApp(id, 'valid', undefined, undefined, '')

        expect(findUser).toHaveBeenCalledTimes(2)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        for (const [, options] of fetchMock.mock.calls) {
            expect(JSON.parse(options.body).difficulty).toBe('')
        }
    })

    test.each([5, 9999])('accepts a time within the allowed range %s without changing it', time => {
        expect(timeSchema.parse(time)).toBe(time)
        expect(validate.time(time)).toBeUndefined()
    })

    test.each([
        [undefined, 'invalid time type, must be a number'],
        ['5', 'invalid time type, must be a number'],
        [null, 'invalid time type, must be a number'],
        [NaN, 'invalid time type, must be a number'],
        [Infinity, 'invalid time type, must be a number'],
        [4.5, 'invalid time type, must be a number'],
        [0, 'invalid time, minimum 5 minutes'],
        [4, 'invalid time, minimum 5 minutes'],
        [10000, 'invalid time, maximum 9999 minutes'],
        [1e20, 'invalid time, maximum 9999 minutes']
    ])('rejects invalid time %s with its existing error', (time, message) => {
        expect(timeSchema.safeParse(time).success).toBe(false)
        expect(() => validate.time(time)).toThrowError(errors.ValidationError)
        expect(() => validate.time(time)).toThrowError(message)
    })

    test('rejects an invalid time in creation and editing before I/O', () => {
        const id = 'a'.repeat(24)
        const message = 'invalid time, minimum 5 minutes'
        expect(() => createRecipe(id, 'valid', undefined, undefined, 4)).toThrowError(message)
        expect(() => updateRecipe(id, id, 'valid', undefined, 4)).toThrowError(message)
        expect(() => createRecipeInApp(id, 'valid', undefined, undefined, 4)).toThrowError(message)
        expect(() => updateRecipeInApp(id, 'valid', undefined, 4)).toThrowError(message)
    })

    test('rejects a time above the limit in creation and editing before I/O', () => {
        const id = 'a'.repeat(24)
        const message = 'invalid time, maximum 9999 minutes'
        expect(() => createRecipe(id, 'valid', undefined, undefined, 10000)).toThrowError(message)
        expect(() => updateRecipe(id, id, 'valid', undefined, 10000)).toThrowError(message)
        expect(() => createRecipeInApp(id, 'valid', undefined, undefined, 10000)).toThrowError(message)
        expect(() => updateRecipeInApp(id, 'valid', undefined, 10000)).toThrowError(message)
    })

    test.each([
        [0, 'invalid time, minimum 5 minutes'],
        [null, 'invalid time type, must be a number'],
        [false, 'invalid time type, must be a number'],
        ['', 'invalid time type, must be a number']
    ])('rejects explicitly provided invalid time %s in both consumers', (time, message) => {
        const id = 'a'.repeat(24)
        expect(() => createRecipe(id, 'valid', undefined, undefined, time)).toThrowError(message)
        expect(() => updateRecipe(id, id, 'valid', undefined, time)).toThrowError(message)
        expect(() => createRecipeInApp(id, 'valid', undefined, undefined, time)).toThrowError(message)
        expect(() => updateRecipeInApp(id, 'valid', undefined, time)).toThrowError(message)
    })

    test('omits an unspecified time in creation and editing requests', async () => {
        const id = 'a'.repeat(24)
        const findUser = vi.spyOn(User, 'findById').mockResolvedValue(null)
        vi.stubGlobal('sessionStorage', { token: 'test-token' })
        const fetchMock = vi.fn((_url, options) => Promise.resolve({
            status: options.method === 'POST' ? 201 : 204,
            json: async () => 'recipe-id'
        }))
        vi.stubGlobal('fetch', fetchMock)

        await expect(createRecipe(id, 'valid')).rejects.toThrow('user not found')
        await expect(updateRecipe(id, id, 'valid')).rejects.toThrow('user not found')
        await createRecipeInApp(id, 'valid')
        await updateRecipeInApp(id, 'valid')

        expect(findUser).toHaveBeenCalledTimes(2)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        for (const [, options] of fetchMock.mock.calls) {
            expect(JSON.parse(options.body)).not.toHaveProperty('time')
        }
    })

    test.each([30, 0])('removes stored time %s when an authorized edit omits it', async storedTime => {
        const id = 'a'.repeat(24)
        const recipe = Recipe.hydrate({ _id: id, author: id, title: 'valid', time: storedTime })
        vi.spyOn(User, 'findById').mockResolvedValue({ _id: id })
        vi.spyOn(Recipe, 'findById').mockResolvedValue(recipe)
        const save = vi.spyOn(recipe, 'save').mockResolvedValue(recipe)

        await updateRecipe(id, id, 'valid')

        expect(save).toHaveBeenCalledOnce()
        expect(recipe.getChanges().$unset).toHaveProperty('time', 1)
    })

    test('does not clear a time when the user is not the author', async () => {
        const id = 'a'.repeat(24)
        const recipe = Recipe.hydrate({ _id: id, author: 'b'.repeat(24), title: 'valid', time: 30 })
        vi.spyOn(User, 'findById').mockResolvedValue({ _id: id })
        vi.spyOn(Recipe, 'findById').mockResolvedValue(recipe)
        const save = vi.spyOn(recipe, 'save')

        await expect(updateRecipe(id, id, 'valid')).rejects.toThrowError(errors.OwnershipError)
        expect(recipe.time).toBe(30)
        expect(save).not.toHaveBeenCalled()
    })

    test.each(['a', 'x'.repeat(800), '🍎'.repeat(400)])('accepts step text without changing it', text => {
        expect(textSchema.parse(text)).toBe(text)
        expect(validate.text(text)).toBeUndefined()
    })

    test.each([
        [null, 'invalid text type, must be a string'],
        ['', 'invalid text length, must be between 1 and 800 characters'],
        ['🍎'.repeat(401), 'invalid text length, must be between 1 and 800 characters']
    ])('rejects invalid step text %s with its existing error', (text, message) => {
        expect(textSchema.safeParse(text).success).toBe(false)
        expect(() => validate.text(text)).toThrowError(errors.ValidationError)
        expect(() => validate.text(text)).toThrowError(message)
    })

    test.each(['a', 'x'.repeat(500), '🍎'.repeat(250)])('accepts a step note without changing it', note => {
        expect(noteSchema.parse(note)).toBe(note)
        expect(stepNoteUpdateSchema.parse(note)).toBe(note)
        expect(validate.note(note)).toBeUndefined()
        expect(validate.noteForUpdate(note)).toBeUndefined()
    })

    test('preserves different empty note rules for direct creation and update validation', () => {
        expect(() => validate.note('')).toThrowError('invalid note length, must be between 1 and 500 characters')
        expect(stepNoteUpdateSchema.parse('')).toBe('')
        expect(validate.noteForUpdate('')).toBeUndefined()
    })

    test.each([
        [null, 'invalid note type, must be a string', 'invalid note type, must be a string'],
        ['🍎'.repeat(251), 'invalid note length, must be between 1 and 500 characters', 'invalid note length, must be 500 characters maximum']
    ])('preserves distinct step note errors for %s', (note, createMessage, updateMessage) => {
        expect(noteSchema.safeParse(note).success).toBe(false)
        expect(stepNoteUpdateSchema.safeParse(note).success).toBe(false)
        expect(() => validate.note(note)).toThrowError(errors.ValidationError)
        expect(() => validate.note(note)).toThrowError(createMessage)
        expect(() => validate.noteForUpdate(note)).toThrowError(errors.ValidationError)
        expect(() => validate.noteForUpdate(note)).toThrowError(updateMessage)
    })

    test('rejects invalid step text and notes in both consumers before I/O', () => {
        const id = 'a'.repeat(24)
        const textMessage = 'invalid text length, must be between 1 and 800 characters'
        const createNoteMessage = 'invalid note length, must be between 1 and 500 characters'
        const updateNoteMessage = 'invalid note length, must be 500 characters maximum'
        const note = '🍎'.repeat(251)

        expect(() => addStepToRecipe(id, id, '')).toThrowError(textMessage)
        expect(() => addStepInApp(id, '')).toThrowError(textMessage)
        expect(() => updateStep(id, id, id, '')).toThrowError(textMessage)
        expect(() => updateStepInApp(id, id, '')).toThrowError(textMessage)
        expect(() => addStepToRecipe(id, id, 'valid', note)).toThrowError(createNoteMessage)
        expect(() => addStepInApp(id, 'valid', note)).toThrowError(createNoteMessage)
        expect(() => updateStep(id, id, id, 'valid', note)).toThrowError(updateNoteMessage)
        expect(() => updateStepInApp(id, id, 'valid', note)).toThrowError(updateNoteMessage)
    })

    test('preserves empty notes when creating and updating steps', async () => {
        const id = 'a'.repeat(24)
        const findUser = vi.spyOn(User, 'findById').mockResolvedValue(null)
        vi.stubGlobal('sessionStorage', { token: 'test-token' })
        const fetchMock = vi.fn((_url, options) => Promise.resolve({
            status: options.method === 'POST' ? 201 : 204,
            json: async () => 'step-id'
        }))
        vi.stubGlobal('fetch', fetchMock)

        await expect(addStepToRecipe(id, id, 'valid', '')).rejects.toThrow('user not found')
        await expect(updateStep(id, id, id, 'valid', '')).rejects.toThrow('user not found')
        await addStepInApp(id, 'valid', '')
        await updateStepInApp(id, id, 'valid', '')

        expect(findUser).toHaveBeenCalledTimes(2)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        for (const [, options] of fetchMock.mock.calls) {
            expect(JSON.parse(options.body).note).toBe('')
        }
    })
})

describe('recipe HTTP validation', () => {
    const secret = 'local-disposable-test-secret'
    let previousSecret
    let server

    beforeAll(async () => {
        previousSecret = process.env.JWT_SECRET
        process.env.JWT_SECRET = secret
        server = await new Promise((resolve, reject) => {
            const listener = createApp().listen(0, '127.0.0.1', () => resolve(listener))
            listener.once('error', reject)
        })
    })

    test.each([
        [{ title: '' }, 'invalid title length, must be between 1 and 50 characters'],
        [{ title: 'valid', description: 'x'.repeat(501) }, 'invalid description length, must be 500 characters maximum'],
        [{ title: 'valid', difficulty: 'hard' }, 'invalid difficulty (must be easy, medium or difficult)'],
        [{ title: 'valid', time: 4 }, 'invalid time, minimum 5 minutes'],
        [{ title: 'valid', time: 4.5 }, 'invalid time type, must be a number'],
        [{ title: 'valid', time: 10000 }, 'invalid time, maximum 9999 minutes']
    ])('preserves HTTP validation errors for invalid recipe fields', async (body, message) => {
        const token = jwt.sign({ sub: 'a'.repeat(24) }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message })
    })

    test.each([
        ['POST', '', 0, 'invalid time, minimum 5 minutes'],
        ['PATCH', '/aaaaaaaaaaaaaaaaaaaaaaaa', 0, 'invalid time, minimum 5 minutes'],
        ['POST', '', null, 'invalid time type, must be a number'],
        ['PATCH', '/aaaaaaaaaaaaaaaaaaaaaaaa', null, 'invalid time type, must be a number']
    ])('rejects invalid time in %s requests', async (method, path, time, message) => {
        const token = jwt.sign({ sub: 'a'.repeat(24) }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes${path}`, {
            method,
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'valid', time })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message })
    })

    test('preserves the HTTP validation error for an invalid recipe image', async () => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes/${id}/images`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: 'not a URL' })
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
            error: 'ValidationError',
            message: 'invalid image syntax, must be a valid URL'
        })
    })

    test.each([
        ['POST', '', { text: 'valid', note: 'x'.repeat(501) }, 'invalid note length, must be between 1 and 500 characters'],
        ['PATCH', '/bbbbbbbbbbbbbbbbbbbbbbbb', { text: 'valid', note: 'x'.repeat(501) }, 'invalid note length, must be 500 characters maximum'],
        ['PATCH', '/bbbbbbbbbbbbbbbbbbbbbbbb', { text: 'valid', note: null }, 'invalid note type, must be a string'],
        ['POST', '', { text: '' }, 'invalid text length, must be between 1 and 800 characters']
    ])('preserves HTTP validation on step %s', async (method, stepPath, body, message) => {
        const id = 'a'.repeat(24)
        const token = jwt.sign({ sub: id }, secret)
        const response = await fetch(`http://127.0.0.1:${server.address().port}/recipes/${id}/steps${stepPath}`, {
            method,
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'ValidationError', message })
    })

    afterAll(async () => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousSecret
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    })
})
