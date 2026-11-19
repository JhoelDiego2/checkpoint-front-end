import { isValidCanonicalStatus } from '../components/statusOptions'

export const PERSONAL_LIST_STORAGE_KEY = 'checkpoint:personal-list'

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function toOptionalString(value) {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed || undefined
}

function toOptionalUrl(value) {
  const url = toOptionalString(value)
  if (!url) return undefined

  try {
    return new URL(url).href
  } catch {
    return undefined
  }
}

function toIsoDateTime(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  // Aceita somente datetime ISO canônico (ex.: 2026-11-19T12:00:00.000Z).
  const iso = date.toISOString()
  return iso === value ? iso : undefined
}

function getNowIso(now) {
  const value = now()
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString()
  }

  return date.toISOString()
}

function withThumbnail(item, thumbnail) {
  return thumbnail ? { ...item, thumbnail } : item
}

/**
 * Valida um item persistido. Itens inválidos são descartados na leitura
 * para não quebrar a UI nem corromper os demais registros.
 */
function parseStoredItem(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const gameId = value.gameId
  const title = toOptionalString(value.title)
  const savedAt = toIsoDateTime(value.savedAt)
  const updatedAt = toIsoDateTime(value.updatedAt)

  if (
    !isValidNumber(gameId) ||
    !title ||
    !isValidCanonicalStatus(value.status) ||
    !savedAt ||
    !updatedAt
  ) {
    return null
  }

  return withThumbnail(
    { gameId, title, status: value.status, savedAt, updatedAt },
    toOptionalUrl(value.thumbnail)
  )
}

/**
 * Constrói um novo PersonalListItem a partir da entrada Recebida.
 * savedAt/updatedAt são gerados quando não informados.
 */
function buildNewItem(input, now) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('[personalListStorage] Campo obrigatório inválido: gameId')
  }

  const gameId = input.gameId
  if (!isValidNumber(gameId)) {
    throw new Error('[personalListStorage] Campo obrigatório inválido: gameId')
  }

  const title = toOptionalString(input.title)
  if (!title) {
    throw new Error('[personalListStorage] Campo obrigatório inválido: title')
  }

  if (!isValidCanonicalStatus(input.status)) {
    throw new Error('[personalListStorage] Status inválido')
  }

  const timestamp = getNowIso(now)

  const savedAt = input.savedAt === undefined || input.savedAt === null
    ? timestamp
    : toIsoDateTime(input.savedAt)
  if (!savedAt) {
    throw new Error('[personalListStorage] Campo obrigatório inválido: savedAt')
  }

  const updatedAt = input.updatedAt === undefined || input.updatedAt === null
    ? timestamp
    : toIsoDateTime(input.updatedAt)
  if (!updatedAt) {
    throw new Error('[personalListStorage] Campo obrigatório inválido: updatedAt')
  }

  return withThumbnail(
    { gameId, title, status: input.status, savedAt, updatedAt },
    toOptionalUrl(input.thumbnail)
  )
}

function getDefaultStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage
}

/**
 * Serviço de persistência da lista pessoal em localStorage.
 *
 * Toda escrita é atômica: a coleção completa é gravada de uma única vez e
 * nenhuma alteração é feita antes das validações de domínio.
 */
export function createPersonalListStorage({
  storage,
  now = () => new Date(),
  storageKey = PERSONAL_LIST_STORAGE_KEY,
} = {}) {
  const getStorage = () => storage ?? getDefaultStorage()

  function readItems() {
    const currentStorage = getStorage()
    if (!currentStorage) return []

    let raw = null
    try {
      raw = currentStorage.getItem(storageKey)
    } catch {
      return []
    }

    if (!raw) return []

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return []
    }

    if (!Array.isArray(parsed)) return []

    const seenGameIds = new Set()

    return parsed.reduce((items, candidate) => {
      const item = parseStoredItem(candidate)

      if (item && !seenGameIds.has(item.gameId)) {
        seenGameIds.add(item.gameId)
        items.push(item)
      }

      return items
    }, [])
  }

  function writeItems(items) {
    const currentStorage = getStorage()
    if (!currentStorage) {
      throw new Error('[personalListStorage] Falha ao acessar o armazenamento local do navegador.')
    }

    try {
      currentStorage.setItem(storageKey, JSON.stringify(items))
    } catch (error) {
      throw new Error('[personalListStorage] Falha ao acessar o armazenamento local do navegador.')
    }
  }

  function listPersonalItems() {
    return readItems().map((item) => ({ ...item }))
  }

  function getPersonalItem(gameId) {
    const item = readItems().find((entry) => entry.gameId === gameId)
    return item ? { ...item } : undefined
  }

  function hasPersonalItem(gameId) {
    return readItems().some((entry) => entry.gameId === gameId)
  }

  function addPersonalItem(input) {
    const item = buildNewItem(input, now)
    const items = readItems()

    if (items.some((entry) => entry.gameId === item.gameId)) {
      throw new Error('Este jogo já está na sua lista pessoal e não pode ser adicionado novamente.')
    }

    writeItems([...items, item])
    return { ...item }
  }

  function updatePersonalItemStatus(gameIdOrInput, maybeStatus) {
    const input = gameIdOrInput && typeof gameIdOrInput === 'object'
      ? gameIdOrInput
      : { gameId: gameIdOrInput, status: maybeStatus }

    const { gameId, status } = input

    // Valida o enum antes de qualquer leitura/escrita para preservar o estado anterior.
    if (!isValidCanonicalStatus(status)) {
      throw new Error('[personalListStorage] Status inválido')
    }

    const items = readItems()
    const index = items.findIndex((entry) => entry.gameId === gameId)

    if (index === -1) {
      throw new Error('[personalListStorage] Jogo não encontrado na lista pessoal.')
    }

    const updatedItem = {
      ...items[index],
      status,
    }

    const nextItems = items.slice()
    nextItems[index] = updatedItem
    writeItems(nextItems)

    return { ...updatedItem }
  }

  return Object.freeze({
    listPersonalItems,
    getPersonalItem,
    hasPersonalItem,
    addPersonalItem,
    updatePersonalItemStatus,
  })
}

const defaultPersonalListStorage = createPersonalListStorage()

export const listPersonalItems = defaultPersonalListStorage.listPersonalItems
export const getPersonalItem = defaultPersonalListStorage.getPersonalItem
export const hasPersonalItem = defaultPersonalListStorage.hasPersonalItem
export const addPersonalItem = defaultPersonalListStorage.addPersonalItem
export const updatePersonalItemStatus = defaultPersonalListStorage.updatePersonalItemStatus
