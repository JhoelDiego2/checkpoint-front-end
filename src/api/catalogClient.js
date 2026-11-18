const REQUIRED_METHODS = ['listGames', 'getGameDetails']
const RAWG_BASE_URL = 'https://api.rawg.io/api'
const CATALOG_PROXY_BASE_URL = '/api/catalog'

function createCatalogClientError(message, { status, details } = {}) {
  const error = new Error(message)
  error.name = 'CatalogClientError'
  error.status = status
  error.details = details
  return error
}

function ensureApiKey(apiKey) {
  if (!apiKey) {
    throw createCatalogClientError(
      '[catalogClient] Chave RAWG ausente. Defina VITE_RAWG_API_KEY no ambiente.',
      { status: 401 }
    )
  }

  return apiKey
}

function buildRawgUrl(path, params, baseUrl = RAWG_BASE_URL) {
  const url = new URL(path, `${baseUrl}/`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url
}

async function fetchJson(url, { signal } = {}) {
  let response

  try {
    response = await fetch(url, { signal })
  } catch (error) {
    throw createCatalogClientError('[catalogClient] Falha de rede ao consultar catálogo.', {
      details: error,
    })
  }

  let payload = null

  try {
    payload = await response.json()
  } catch {
    // ignora parse quando não há corpo JSON válido
  }

  if (!response.ok) {
    throw createCatalogClientError(
      `[catalogClient] Erro RAWG (${response.status}) ao consultar catálogo.`,
      {
        status: response.status,
        details: payload,
      }
    )
  }

  return payload
}

function createNotImplementedMethod(methodName, strategyName) {
  return async () => {
    throw new Error(
      `[catalogClient] Método "${methodName}" não implementado para a estratégia "${strategyName}".`
    )
  }
}

/**
 * Interface única do cliente de catálogo, independente da estratégia.
 *
 * Estratégias (direto/proxy) devem fornecer implementações para os métodos
 * desta interface por meio do parâmetro `implementation`.
 */
export function createCatalogClient({ strategy = 'unknown', implementation = {} } = {}) {
  const client = {
    strategy,
    listGames:
      typeof implementation.listGames === 'function'
        ? implementation.listGames
        : createNotImplementedMethod('listGames', strategy),
    getGameDetails:
      typeof implementation.getGameDetails === 'function'
        ? implementation.getGameDetails
        : createNotImplementedMethod('getGameDetails', strategy),
  }

  return Object.freeze(client)
}

export function validateCatalogClient(client) {
  if (!client || typeof client !== 'object') {
    throw new Error('[catalogClient] Cliente inválido.')
  }

  for (const methodName of REQUIRED_METHODS) {
    if (typeof client[methodName] !== 'function') {
      throw new Error(`[catalogClient] Interface inválida: método obrigatório "${methodName}" ausente.`)
    }
  }

  return true
}

/**
 * Integração direta RAWG no navegador (Opção A / T006).
 */
export function createDirectRawgCatalogClient({
  apiKey = import.meta.env.VITE_RAWG_API_KEY,
  baseUrl = RAWG_BASE_URL,
} = {}) {
  const key = ensureApiKey(apiKey)

  return createCatalogClient({
    strategy: 'direct',
    implementation: {
      async listGames({ search = '', page = 1, page_size = 20, signal } = {}) {
        const url = buildRawgUrl(
          'games',
          {
            key,
            search,
            page,
            page_size,
          },
          baseUrl
        )

        return fetchJson(url, { signal })
      },

      async getGameDetails({ gameId, signal } = {}) {
        if (!gameId) {
          throw createCatalogClientError('[catalogClient] gameId é obrigatório para detalhe do jogo.')
        }

        const url = buildRawgUrl(`games/${gameId}`, { key }, baseUrl)
        return fetchJson(url, { signal })
      },
    },
  })
}

/**
 * Integração via proxy/backend (Opção B / T007).
 *
 * Não envia `key` no cliente. A autenticação com RAWG deve ser feita no backend.
 */
export function createProxyCatalogClient({
  baseUrl = import.meta.env.VITE_CATALOG_PROXY_BASE_URL || CATALOG_PROXY_BASE_URL,
} = {}) {
  return createCatalogClient({
    strategy: 'proxy',
    implementation: {
      async listGames({ search = '', page = 1, page_size = 20, signal } = {}) {
        const url = buildRawgUrl(
          'games',
          {
            search,
            page,
            page_size,
          },
          baseUrl
        )

        return fetchJson(url, { signal })
      },

      async getGameDetails({ gameId, signal } = {}) {
        if (!gameId) {
          throw createCatalogClientError('[catalogClient] gameId é obrigatório para detalhe do jogo.')
        }

        const url = buildRawgUrl(`games/${gameId}`, {}, baseUrl)
        return fetchJson(url, { signal })
      },
    },
  })
}
