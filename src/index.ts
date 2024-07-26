
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { frontendHtml, notFoundHtml, redirectHtml } from './html'
import { validateUrl, saveUrl, overwriteUrl } from './helpers'
import { config } from './config'

const schema = z.object({
    url: z.string(),
    alias: z.string().optional(),
})

const app = new Hono<{ Bindings: Bindings }>()

app.notFound((c) => c.html(notFoundHtml, 404))

app.post(config.frontendRoute, zValidator('json', schema), async (c) => {
    const body = c.req.valid('json')
    const isValidUrl = validateUrl(body.url)
    if (isValidUrl) {
        let alias
        if (!body.alias) {
            alias = await saveUrl(c.env, body.url)
        } else {
            alias = await overwriteUrl(c.env, body.url, body.alias)
        }
        return c.json({ status: 'success', message: 'Alias has been created.', alias: alias }, 200)
    } else {
        return c.json({ status: 'error', message: 'Invalid URL.', alias: null }, 400)
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
            return c.html(notFoundHtml, 404)
        }
    }
})

export default {
    fetch: app.fetch
}