/**
 * Checks if URL is valid.
 * @param {string} url URL to be checked.
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
 * Creates hash.
 * @param {string} str String to be hashed.
 * @returns {string} Hash.
 */
async function createHash(str: string, salt: string) {
    const encodedString = new TextEncoder().encode(str + salt)
    const hashBuffer = await crypto.subtle.digest(
        {
            name: 'SHA-1',
        },
        encodedString
    )
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashString = hashArray.map(byte => String.fromCharCode(byte)).join('')
    const hashBase64 = btoa(hashString)
    const finalHash = hashBase64.replace(/\+|\/|=|l|1|I|0|o|O|g|q/g, '')
    return finalHash
}

/**
 * Saves URL to Cloudflare Workers KV namespace.
 * @param {Bindings} env Cloudflare Workers Binding.
 * @param {string} url URL to be shortened.
 * @returns {string} URL alias.
 */
export async function saveUrl(env: Bindings, url: string) {
    let chars = Number(env.ALIAS_LENGTH)
    const salt = env.SALT
    const hash = await createHash(url, salt)
    let shortHash = hash.slice(0, chars)
    let hashInKv = await env.KV.get(shortHash)
    if (hashInKv) {
        if (hashInKv == hash) {
            return shortHash
        } else {
            while (true) {
                chars++
                hashInKv = await env.KV.get(hash.slice(0, chars))
                if (hashInKv == hash) {
                    return hash.slice(0, chars)
                } else if (!hashInKv) {
                    shortHash = hash.slice(0, chars)
                    break
                }
            }
        }
    }
    await env.KV.put(shortHash, hash, { metadata: { url: url } })
    return shortHash
}

/**
 * Overwrite existing alias or save URL with custom alias to Cloudflare Workers KV namespace.
 * @param {Bindings} env Cloudflare Workers Binding.
 * @param {string} url URL to be shortened.
 * @param {string} alias URL alias.
 * @returns {string} URL alias.
 */
export async function overwriteUrl(env: Bindings, url: string, alias: string) {
    const salt = env.SALT
    const hash = await createHash(url, salt)
    await env.KV.put(alias, hash, { metadata: { url: url } })
    return alias
}