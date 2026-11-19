import { useState } from 'react'
import { listPersonalItems, updatePersonalItemStatus } from '../api/personalListStorage'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import GameStatusBadge from '../components/GameStatusBadge'
import { STATUS_OPTIONS, isValidCanonicalStatus } from '../components/statusOptions'
import { UI_MESSAGES, getErrorMessage } from '../components/uiMessages'
import '../components/catalog.css'

export default function MinhaListaPage() {
  const [items, setItems] = useState(() => listPersonalItems())
  const [feedback, setFeedback] = useState(null)

  function refreshItems() {
    setItems(listPersonalItems())
  }

  function handleStatusChange(item, event) {
    const nextStatus = event.target.value

    if (!isValidCanonicalStatus(nextStatus)) {
      setFeedback({ type: 'error', message: getErrorMessage('invalid-status') })
      return
    }

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

                <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.75rem' }}>
                  <label
                    htmlFor={`personal-list-status-${item.gameId}`}
                    style={{ color: 'var(--text-h)', fontSize: '0.95rem', fontWeight: 600 }}
                  >
                    Alterar status:
                  </label>
                  <select
                    id={`personal-list-status-${item.gameId}`}
                    value={isValidCanonicalStatus(item.status) ? item.status : STATUS_OPTIONS[0].value}
                    onChange={(event) => handleStatusChange(item, event)}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      minHeight: '2.75rem',
                      padding: '0.55rem 0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-h)',
                      background: 'var(--bg)',
                      font: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
