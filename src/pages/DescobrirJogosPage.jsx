import { useEffect, useRef, useState } from 'react'
import { mapRawgListToCatalogResponse } from '../api/catalogMapper'
import { createDirectRawgCatalogClient } from '../api/catalogClient'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import GameCard from '../components/GameCard'
import LoadingState from '../components/LoadingState'
import SearchBar from '../components/SearchBar'
import { UI_MESSAGES, getErrorMessage } from '../components/uiMessages'
import '../components/catalog.css'

async function requestCatalogGames(search, page, signal) {
  const client = createDirectRawgCatalogClient()
  const response = await client.listGames({
    search,
    page,
    page_size: 20,
    signal,
  })

  return mapRawgListToCatalogResponse(response)
}

export default function DescobrirJogosPage() {
  const [games, setGames] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [currentSearch, setCurrentSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const activeRequest = useRef(null)

  async function fetchCatalog(search, targetPage) {
    activeRequest.current?.abort()

    const controller = new AbortController()
    activeRequest.current = controller
    setIsLoading(true)
    setError(null)

    try {
      const catalogData = await requestCatalogGames(search, targetPage, controller.signal)

      if (activeRequest.current === controller) {
        setGames(catalogData.results)
        setCount(catalogData.count)
        setPage(targetPage)
        setHasNext(Boolean(catalogData.next))
        setHasPrevious(Boolean(catalogData.previous))
      }
    } catch (requestError) {
      if (activeRequest.current === controller && requestError?.name !== 'AbortError') {
        setError(requestError)
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null
        setIsLoading(false)
      }
    }
  }

  function handleSearch(search = '') {
    setCurrentSearch(search)
    fetchCatalog(search, 1)
  }

  function handleNextPage() {
    if (hasNext && !isLoading) {
      fetchCatalog(currentSearch, page + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handlePreviousPage() {
    if (hasPrevious && !isLoading && page > 1) {
      fetchCatalog(currentSearch, page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    fetchCatalog('', 1)

    return () => {
      activeRequest.current?.abort()
      activeRequest.current = null
    }
  }, [])

  const isApiKeyError = error?.status === 401 || error?.status === '401'
  const errorMessage = isApiKeyError
    ? getErrorMessage(401)
    : error?.status >= 500 || error?.status === 'network' || !error?.status
    ? getErrorMessage('network')
    : getErrorMessage(error?.status)

  return (
    <main className="catalog-page">
      <header className="catalog-page__header">
        <h1>Descobrir jogos</h1>
        <p>Pesquise jogos e conheça o catálogo disponível.</p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <LoadingState message={UI_MESSAGES.loading.catalog} />}
      {!isLoading && error && (
        <ErrorState
          message={errorMessage}
          onRetry={isApiKeyError ? undefined : () => fetchCatalog(currentSearch, page)}
          retryLabel="Tentar novamente"
        />
      )}
      {!isLoading && !error && games.length === 0 && (
        <EmptyState message={currentSearch ? UI_MESSAGES.empty.search : UI_MESSAGES.empty.catalog} />
      )}
      {!isLoading && !error && games.length > 0 && (
        <>
          <div className="catalog-pagination-info" style={{ marginBottom: '1rem', color: 'var(--text)' }}>
            Exibindo página {page} de {Math.max(1, Math.ceil(count / 20))} ({count} jogos encontrados)
          </div>

          <ul className="catalog-game-grid" aria-label="Jogos encontrados">
            {games.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))}
          </ul>

          <nav className="catalog-pagination" aria-label="Paginação do catálogo" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={!hasPrevious || isLoading}
              className="catalog-search__submit"
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={!hasNext || isLoading}
              className="catalog-search__submit"
            >
              Próxima
            </button>
          </nav>
        </>
      )}
    </main>
  )
}
