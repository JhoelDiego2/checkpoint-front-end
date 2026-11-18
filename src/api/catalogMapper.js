function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function toOptionalString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function toOptionalUrl(value) {
  const url = toOptionalString(value)

  if (!url) return undefined

  try {
    const parsed = new URL(url)
    return parsed.href
  } catch {
    return undefined
  }
}

function stripHtml(htmlText) {
  const text = toOptionalString(htmlText)
  if (!text) return undefined

  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function mapPlatform(platforms) {
  if (!Array.isArray(platforms) || platforms.length === 0) return undefined

  const names = platforms
    .map((item) => toOptionalString(item?.platform?.name ?? item?.name))
    .filter(Boolean)

  return names.length ? names.join(', ') : undefined
}

function mapFirstNamedItem(items) {
  if (!Array.isArray(items) || items.length === 0) return undefined
  return toOptionalString(items[0]?.name)
}

function mapScreenshots(rawgGame) {
  const fromShort = Array.isArray(rawgGame?.short_screenshots)
    ? rawgGame.short_screenshots.map((item) => item?.image)
    : []

  const fromDetail = Array.isArray(rawgGame?.screenshots)
    ? rawgGame.screenshots.map((item) => item?.image)
    : []

  const all = [...fromShort, ...fromDetail].map(toOptionalUrl).filter(Boolean)
  const unique = [...new Set(all)]

  return unique.length ? unique : undefined
}

/**
 * Mapeia um jogo da RAWG para o contrato CatalogGame do app.
 * Regra de robustez: campos opcionais ausentes retornam `undefined`.
 */
export function mapRawgGameToCatalogGame(rawgGame) {
  const id = rawgGame?.id

  if (!isValidNumber(id)) {
    throw new Error('[catalogMapper] Campo obrigatório inválido: id')
  }

  const title = toOptionalString(rawgGame?.name)
  if (!title) {
    throw new Error('[catalogMapper] Campo obrigatório inválido: title')
  }

  const description = toOptionalString(rawgGame?.description_raw) ?? stripHtml(rawgGame?.description)

  return {
    id,
    title,
    thumbnail: toOptionalUrl(rawgGame?.background_image),
    shortDescription: description ? description.slice(0, 160) : undefined,
    description,
    genre: mapFirstNamedItem(rawgGame?.genres),
    platform: mapPlatform(rawgGame?.platforms),
    releaseDate: toOptionalString(rawgGame?.released),
    publisher: mapFirstNamedItem(rawgGame?.publishers),
    developer: mapFirstNamedItem(rawgGame?.developers),
    screenshots: mapScreenshots(rawgGame),
  }
}

/**
 * Mapeia resposta de listagem da RAWG mantendo metadados de paginação.
 * Itens inválidos são descartados para não quebrar a UI.
 */
export function mapRawgListToCatalogResponse(rawgListResponse) {
  const rawResults = Array.isArray(rawgListResponse?.results) ? rawgListResponse.results : []

  const results = rawResults
    .map((item) => {
      try {
        return mapRawgGameToCatalogGame(item)
      } catch {
        return null
      }
    })
    .filter(Boolean)

  return {
    count: isValidNumber(rawgListResponse?.count) ? rawgListResponse.count : 0,
    next: toOptionalString(rawgListResponse?.next),
    previous: toOptionalString(rawgListResponse?.previous),
    results,
  }
}
