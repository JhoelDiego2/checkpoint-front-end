import { useState } from 'react'
import { listPersonalItems, updatePersonalItemStatus } from '../api/personalListStorage'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import GameStatusBadge from '../components/GameStatusBadge'
import StatusSelector from '../components/StatusSelector'
import { UI_MESSAGES, getErrorMessage } from '../components/uiMessages'
import '../components/catalog.css'

export default function MinhaListaPage() {
  const [items, setItems] = useState(() => listPersonalItems())
  const [feedback, setFeedback] = useState(null)

  function refreshItems() {
    setItems(listPersonalItems())
  }

  function handleStatusChange(item, nextStatus) {
    if (nextStatus === item.status) return

    try {
      updatePersonalItemStatus(item.gameId, nextStatus)
      refreshItems()
      setFeedback({ type: 'success', message: UI_MESSAGES.success.statusUpdated })
    } catch (error) {
      // A gravação é atômica: reler garante que a interface mostre o estado salvo.
      refreshItems()
      setFeedback({
        type: 'error',
        message: getErrorMessage(error?.code ?? 'generic'),
      })
    }
  }

  return (
    <main className="catalog-page">
      <header className="catalog-page__header">
        <h1>Minha Lista</h1>
        <p className="personal-list__storage-warning" role="note">
          Esta lista fica salva apenas neste navegador. Não há sincronização entre dispositivos;
          limpar os dados do navegador pode apagar os jogos cadastrados.
        </p>
      </header>

      {feedback?.type === 'success' && (
        <p role="status" aria-live="polite" className="personal-list__feedback">
          {feedback.message}
        </p>
      )}

      {feedback?.type === 'error' && <ErrorState message={feedback.message} />}

      {items.length === 0 ? (
        <EmptyState message={UI_MESSAGES.empty.personalList} />
      ) : (
        <ul className="catalog-game-grid">
          {items.map((item) => (
            <li className="catalog-game-card" key={item.gameId}>
              {item.thumbnail ? (
                <img
                  className="catalog-game-card__image"
                  src={item.thumbnail}
                  alt={`Capa de ${item.title}`}
                  loading="lazy"
                />
              ) : (
                <div
                  className="catalog-game-card__image-fallback"
                  role="img"
                  aria-label="Imagem indisponível"
                >
                  Imagem indisponível
                </div>
              )}

              <div className="catalog-game-card__content">
                <h2>{item.title}</h2>
                <p>
                  Status atual: <GameStatusBadge status={item.status} />
                </p>

                <div style={{ display: 'grid', marginTop: '0.75rem' }}>
                  <StatusSelector
                    id={`personal-list-status-${item.gameId}`}
                    value={item.status}
                    onChange={(nextStatus) => handleStatusChange(item, nextStatus)}
                    label="Alterar status:"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
