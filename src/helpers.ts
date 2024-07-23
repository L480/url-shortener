/**
 * Creates random string.
 * @param {number} len - Length of the random string.
 * @returns {string} Random string.
 */
async function randomString(len: number) {
    len = len || 3
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let maxPos = $chars.length
    let result = ''
    for (let i = 0; i < len; i++) {
        result += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return result
}

/**
 * Checks if URL is valid.
 * @param {string} url - URL to be checked.
 * @returns {boolean} True if URL is valid, false if invalid.
 */
export function validateUrl(url: string) {
    try {
        new URL(url)
        return true
    } catch (err) {
        return false
    }
}

/**
 * Saves URL to Cloudflare Workers KV.
 * @param {Bindings} env - Cloudflare Workers Binding.
 * @param {string} longUrl - URL to be shortened.
 * @param {number} len - Length of the random key used for the short URL route.
 * @returns {string} Random key which is being used as short URL route.
 */
export async function saveUrl(env: Bindings, longUrl: string, len: number) {
    let randomKey = ''
    const values: KVNamespaceListResult<Metadata> = await env.kv.list()
    for (let item of values.keys) {
        if (item.metadata && item.metadata.url == longUrl) {
            randomKey = item.name
        }
    }
    if (randomKey) {
        return randomKey
    } else {
        randomKey = await randomString(len)
        const doesExist = await env.kv.get(randomKey)
        if (doesExist) {
            saveUrl(env, longUrl, len) // Try again and create a different random string
        } else {
            await env.kv.put(randomKey, longUrl, { metadata: { url: longUrl } })
            return randomKey
        }
    }
}