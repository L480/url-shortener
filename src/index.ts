
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
        const alias = await saveUrl(c.env, body.url)
        return c.json({ status: 'success', message: alias }, 200)
    } else {
        return c.json({ status: 'error', message: 'Invalid URL.' }, 400)
    }
})

app.get(config.frontendRoute, async (c) => {
    return c.html(frontendHtml)
})

app.get('/*', async (c) => {
    const alias = c.req.path.split('/')[1]
    if (alias) {
        const { value, metadata }: KVNamespaceGetWithMetadataResult<string, Metadata> = await c.env.KV.getWithMetadata(alias);
        if (value && metadata) {
            const redirect = redirectHtml.replace(/{Replace}/gm, metadata.url) // Hide referrer header
            return c.html(redirect)
        } else {
            return c.text('Not found.', 404)
        }
    }
})

export default {
    fetch: app.fetch
}