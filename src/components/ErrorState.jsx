import { UI_MESSAGES } from './uiMessages'

export default function ErrorState({
  message = UI_MESSAGES.error.generic,
  onRetry,
  retryLabel = 'Tentar novamente',
}) {
  return (
    <div role="alert">
      <p>{message}</p>
      {typeof onRetry === 'function' && (
        <button type="button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  )
}
