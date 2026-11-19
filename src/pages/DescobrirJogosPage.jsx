import { useEffect, useRef, useState } from 'react'
import { mapRawgListToCatalogResponse } from '../api/catalogMapper'
import { createDirectRawgCatalogClient } from '../api/catalogClient'
import ErrorState from '../components/ErrorState'
import GameCard from '../components/GameCard'
import LoadingState from '../components/LoadingState'
import SearchBar from '../components/SearchBar'
import { UI_MESSAGES } from '../components/uiMessages'
import '../components/catalog.css'

async function requestCatalogGames(search, signal) {
  const client = createDirectRawgCatalogClient()
  const response = await client.listGames({
    search,
    page: 1,
    page_size: 20,
    signal,
  })

  return mapRawgListToCatalogResponse(response).results
}

export default function DescobrirJogosPage() {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const activeRequest = useRef(null)

  async function searchGames(search = '') {
    activeRequest.current?.abort()

    const controller = new AbortController()
    activeRequest.current = controller
    setIsLoading(true)
    setError(null)

    try {
      const results = await requestCatalogGames(search, controller.signal)

      if (activeRequest.current === controller) {
        setGames(results)
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

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true
    activeRequest.current = controller

    async function loadInitialCatalog() {
      try {
        const results = await requestCatalogGames('', controller.signal)

        if (isActive) {
          setGames(results)
        }
      } catch (requestError) {
        if (isActive && requestError?.name !== 'AbortError') {
          setError(requestError)
        }
      } finally {
        if (isActive) {
          activeRequest.current = null
          setIsLoading(false)
        }
      }
    }

    loadInitialCatalog()

    return () => {
      isActive = false
      activeRequest.current?.abort()
      activeRequest.current = null
    }
  }, [])

  return (
    <main className="catalog-page">
      <header className="catalog-page__header">
        <h1>Descobrir jogos</h1>
        <p>Pesquise jogos e conheça o catálogo disponível.</p>
      </header>

      <SearchBar onSearch={searchGames} isLoading={isLoading} />

      {isLoading && <LoadingState message={UI_MESSAGES.loading.catalog} />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && games.length > 0 && (
        <ul className="catalog-game-grid" aria-label="Jogos encontrados">
          {games.map((game) => (
            <li key={game.id}>
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
