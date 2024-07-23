
import { Hono } from 'hono'
import { frontendHtml, redirectHtml } from './html'
import { validateUrl, saveUrl } from './helpers'
import { config } from './config'

const app = new Hono<{ Bindings: Bindings }>()

app.notFound((c) => c.text('Not found.', 404))

app.post(config.frontendRoute, async (c) => {
    const body: ApiRequestBody = await c.req.json()
    const isValidUrl = validateUrl(body.url)
    if (isValidUrl) {
        const randomKey = await saveUrl(c.env, body.url, Number(config.urlLength))
        return c.json({ status: 'success', message: randomKey }, 200)
    } else {
        return c.json({ status: 'error', message: 'Invalid URL.' }, 400)
    }
})

app.get(config.frontendRoute, async (c) => {
    return c.html(frontendHtml)
})

app.get('/*', async (c) => {
    const path = c.req.path.split('/')[1]
    if (path) {
        const value = await c.env.kv.get(path)
        if (value) {
            const resp = redirectHtml.replace(/{Replace}/gm, value) // Hide referrer header
            return c.html(resp)
        } else {
            return c.text('Not found.', 404)
        }
    }
})

export default {
    fetch: app.fetch
}