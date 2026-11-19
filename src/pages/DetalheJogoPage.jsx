import { useEffect, useState } from 'react'
import { createDirectRawgCatalogClient } from '../api/catalogClient'
import { mapRawgGameToCatalogGame } from '../api/catalogMapper'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import { UI_MESSAGES, getErrorMessage } from '../components/uiMessages'
import '../components/catalog.css'

const DETAIL_FIELDS = [
  { key: 'genre', label: 'Gênero' },
  { key: 'platform', label: 'Plataformas' },
  { key: 'releaseDate', label: 'Lançamento' },
  { key: 'developer', label: 'Desenvolvedora' },
  { key: 'publisher', label: 'Publicadora' },
]

/**
 * O detalhe pode ser aberto por prop (quando o roteamento existir) ou pela URL,
 * sem depender de uma biblioteca de rotas nesta tarefa.
 */
function resolveGameIdFromLocation() {
  if (typeof window === 'undefined') return undefined

  const { search = '', hash = '', pathname = '' } = window.location
  const params = new URLSearchParams(search)
  const fromQuery = params.get('jogo') ?? params.get('gameId') ?? params.get('id')

  if (fromQuery) return fromQuery

  const fromHash = hash.match(/#\/jogos?\/(\d+)\/?$/)
  if (fromHash) return fromHash[1]

  const fromPath = pathname.match(/\/jogos?\/(\d+)\/?$/)
  return fromPath ? fromPath[1] : undefined
}

function normalizeGameId(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : undefined
  }

  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim())
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }

  return undefined
}

async function requestGameDetails(gameId, signal) {
  const client = createDirectRawgCatalogClient()
  const rawGame = await client.getGameDetails({ gameId, signal })
  return mapRawgGameToCatalogGame(rawGame)
}

export default function DetalheJogoPage({ gameId }) {
  const id = normalizeGameId(gameId ?? resolveGameIdFromLocation())
  const [retryCount, setRetryCount] = useState(0)
  const requestKey = `${id ?? ''}:${retryCount}`

  const [request, setRequest] = useState(() => ({
    key: requestKey,
    status: id ? 'loading' : 'idle',
    game: null,
    error: null,
  }))

  useEffect(() => {
    if (!id) return undefined

    const controller = new AbortController()
    const key = requestKey

    async function loadGameDetails() {
      try {
        const mappedGame = await requestGameDetails(id, controller.signal)

        if (!controller.signal.aborted) {
          setRequest({ key, status: 'success', game: mappedGame, error: null })
        }
      } catch (requestError) {
        if (!controller.signal.aborted && requestError?.name !== 'AbortError') {
          setRequest({ key, status: 'error', game: null, error: requestError })
        }
      }
    }

    loadGameDetails()

    return () => controller.abort()
  }, [id, requestKey])

  const status = !id
    ? 'idle'
    : request.key === requestKey
      ? request.status
      : 'loading'
  const game = status === 'success' ? request.game : null
  const error = status === 'error' ? request.error : null
  const errorStatus = error?.status ?? error?.code
  const isApiKeyError = errorStatus === 401 || errorStatus === '401'
  const errorMessage = isApiKeyError
    ? getErrorMessage(401)
    : errorStatus >= 500 || errorStatus === 'network' || !errorStatus
      ? getErrorMessage('network')
      : getErrorMessage(errorStatus)
  const availableFields = game
    ? DETAIL_FIELDS.filter(({ key }) => Boolean(game[key]))
    : []
  const screenshots = game?.screenshots ?? []

  return (
    <main className="catalog-page catalog-detail">
      <header className="catalog-page__header">
        <a className="catalog-detail__back" href="./">
          ← Voltar para a descoberta
        </a>
        <h1>{game?.title ?? 'Detalhes do jogo'}</h1>
      </header>

      {status === 'loading' && <LoadingState message={UI_MESSAGES.loading.details} />}

      {status === 'idle' && (
        <EmptyState message="Nenhum jogo selecionado. Volte para a descoberta e escolha um jogo." />
      )}

      {status === 'error' && (
        <ErrorState
          message={errorMessage}
          onRetry={isApiKeyError ? undefined : () => setRetryCount((current) => current + 1)}
          retryLabel="Tentar novamente"
        />
      )}

      {status === 'success' && game && (
        <article className="catalog-detail__content">
          <div className="catalog-detail__media">
            {game.thumbnail ? (
              <img
                className="catalog-detail__image"
                src={game.thumbnail}
                alt={`Capa de ${game.title}`}
              />
            ) : (
              <div
                className="catalog-detail__image-fallback"
                role="img"
                aria-label="Imagem indisponível"
              >
                Imagem indisponível
              </div>
            )}
          </div>

          <section className="catalog-detail__section" aria-labelledby="catalog-detail-description-title">
            <h2 id="catalog-detail-description-title">Sobre o jogo</h2>
            <p>{game.description || game.shortDescription || 'Descrição não disponível.'}</p>
          </section>

          <section className="catalog-detail__section" aria-labelledby="catalog-detail-info-title">
            <h2 id="catalog-detail-info-title">Informações do jogo</h2>
            {availableFields.length > 0 ? (
              <dl className="catalog-detail__facts">
                {availableFields.map(({ key, label }) => (
                  <div className="catalog-detail__fact" key={key}>
                    <dt>{label}</dt>
                    <dd>{game[key]}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Informações adicionais não disponíveis.</p>
            )}
          </section>

          {screenshots.length > 0 && (
            <section
              className="catalog-detail__section"
              aria-labelledby="catalog-detail-screenshots-title"
            >
              <h2 id="catalog-detail-screenshots-title">Capturas de tela</h2>
              <ul className="catalog-detail__screenshots">
                {screenshots.map((url) => (
                  <li key={url}>
                    <img src={url} alt={`Captura de tela de ${game.title}`} loading="lazy" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}

      <footer className="catalog-footer">
        Dados fornecidos por{' '}
        <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">
          RAWG Video Games Database
        </a>
        .
      </footer>
    </main>
  )
}
