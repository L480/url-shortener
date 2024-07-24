type Bindings = {
    KV: KVNamespace
    ALIAS_LENGTH: string
    SALT: string
}

interface Metadata {
    url: string
}

interface ApiRequestBody {
    url: string
}