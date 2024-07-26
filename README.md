# 🔗 url-shortener

Serverless URL shortener based on Cloudflare Workers and Cloudflare Workers KV.

![url-shortener](/images/header.png "url-shortener")

## Setup

### 1. Deploy Worker to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/L480/url-shortener)

### 2. Create KV Namespace and KV Binding

![Create KV Binding](/images/kv-binding.png "Create KV Binding")

### 3. Grab Your Worker URL

Grab your Worker URL and go to `https://url-shortener.my-account.workers.dev/shorten`.

> [!TIP]
> Use [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/) to protect the `/shorten` route behind an [Entra ID authentication](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/cloudflare-integration).

### 4. Shorten Your First URL

![Shorten Your First URL](/images/shorten-url.png "Shorten Your First URL")

## API

### Shorten URL

#### HTTP Request

```http
POST /shorten
```

#### Request Body

##### Random Alias

```json
{
    "url": "https://google.com"
}
```

##### Custom Alias

```json
{
    "url": "https://google.com",
    "alias": "hZk"
}
```

#### Response

```json
{
    "status": "success",
    "message": "Alias has been created.",
    "alias": "hZk"
}
```

## FAQ

- How long are the shortened URLs?
    - By default it's your root domain `example.com` + a 3 character alias (`example.com/aS3`). Shortening the same URL multiple times would result in the same alias. 3 characters would last for about 200k unique aliases if no hash collision occurs. After exceeding ~200k unique aliases, each new alias is a hash collision, resulting in the behavior described below.
- What happens in case of a hash collision?
    - In case of a hash collision an additional character would be appended to your alias (`example.com/aS3q`).
    - Hash collisions increase the read operations on the KV namespace (+1 for each appended character), resulting in higher costs. If you are expecting many alias creations, increase [`ALIAS_LENGTH`](wrangler.toml#L14) before going live.
- Can I increase the length of my aliases?
    - You can increase the alias length via the [`ALIAS_LENGTH`](wrangler.toml#L14) variable.
    - Only increase [`ALIAS_LENGTH`](wrangler.toml#L14) if your KV namespace is empty, otherwise duplicated aliases are being created.
- Are the aliases the same across all deployed workers?
    - If you don't change the [`SALT`](wrangler.toml#L15) variable, the aliases will be the same.
