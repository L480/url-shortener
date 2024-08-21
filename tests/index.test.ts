import { app } from '../src'
import { frontendHtml, notFoundHtml, redirectHtml } from '../src/html'

it('test url shortening', async () => {
  const MOCK_ENV = {
    ALIAS_LENGTH: "3",
    SALT: "tX5PbT",
    KV: {
      get: (key: string) => {
        if (key == 'N6d') {
          return null
        }
      },
      put: (key: string) => {
        if (key == 'N6d') {
          return key
        }
      },
    },
  }
  const res = await app.request('/shorten', {
    method: 'POST',
    body: JSON.stringify({ 'url': 'https://google.de' }),
    headers: { 'Content-Type': 'application/json' }
  }, MOCK_ENV)
  const json = await res.json() as { status: string, message: string, alias: string }
  expect(json.status).toBe('success')
  expect(json.message).toBe('Alias has been created.')
  expect(json.alias).toBe('N6d')
})

it('test url shortening with hash collision', async () => {
  const MOCK_ENV = {
    ALIAS_LENGTH: "3",
    SALT: "tX5PbT",
    KV: {
      get: (key: string) => {
        if (key == 'N6d') {
          return key
        }
      },
      put: (key: string) => {
        if (key == 'N6dH') {
          return key
        }
      },
    },
  }
  const res = await app.request('/shorten', {
    method: 'POST',
    body: JSON.stringify({ 'url': 'https://google.de' }),
    headers: { 'Content-Type': 'application/json' }
  }, MOCK_ENV)
  const json = await res.json() as { status: string, message: string, alias: string }
  expect(json.status).toBe('success')
  expect(json.message).toBe('Alias has been created.')
  expect(json.alias).toBe('N6dH')
})

it('test url shortening with custom alias', async () => {
  const MOCK_ENV = {
    ALIAS_LENGTH: "3",
    SALT: "tX5PbT",
    KV: {
      get: (key: string) => {
        if (key == 'test') {
          return null
        }
      },
      put: (key: string) => {
        if (key == 'test') {
          return key
        }
      },
    },
  }
  const res = await app.request('/shorten', {
    method: 'POST',
    body: JSON.stringify({ 'url': 'https://google.de', 'alias': 'test' }),
    headers: { 'Content-Type': 'application/json' }
  }, MOCK_ENV)
  const json = await res.json() as { status: string, message: string, alias: string }
  expect(json.status).toBe('success')
  expect(json.message).toBe('Alias has been created.')
  expect(json.alias).toBe('test')
})

it('test url shortening with invalid URL', async () => {
  const MOCK_ENV = {
    ALIAS_LENGTH: "3",
    SALT: "tX5PbT",
    KV: {
      get: (key: string) => {
        if (key == 'test') {
          return null
        }
      },
      put: (key: string) => {
        if (key == 'test') {
          return key
        }
      },
    },
  }
  const res = await app.request('/shorten', {
    method: 'POST',
    body: JSON.stringify({ 'url': 'https//google.de', 'alias': 'test' }),
    headers: { 'Content-Type': 'application/json' }
  }, MOCK_ENV)
  const json = await res.json() as { status: string, message: string, alias: string }
  expect(json.status).toBe('error')
  expect(json.message).toBe('Invalid URL.')
  expect(json.alias).toBe(null)
})

it('test url redirection', async () => {
  const MOCK_ENV = {
    ALIAS_LENGTH: "3",
    SALT: "tX5PbT",
    KV: {
      getWithMetadata: (key: string) => {
        if (key == 'N6d') {
          return {
            value: 'N6dHxxxxx',
            metadata: {
              url: 'https://google.de'
            }
          }
        }
      }
    },
  }
  const res = await app.request('/N6d', {
    method: 'GET'
  }, MOCK_ENV)
  const body = await res.text()
  expect(body).toBe(redirectHtml.replaceAll('{Replace}', 'https://google.de'))
})

it('test frontend', async () => {
  const res = await app.request('/shorten', {
    method: 'GET'
  })
  const body = await res.text()
  expect(body).toBe(frontendHtml)
})

it('test 404', async () => {
  const res = await app.request('/', {
    method: 'GET'
  })
  const body = await res.text()
  expect(body).toBe(notFoundHtml)
})