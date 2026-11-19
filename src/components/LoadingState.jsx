import { UI_MESSAGES } from './uiMessages'

export default function LoadingState({ message = UI_MESSAGES.loading.catalog }) {
  return (
    <div role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  )
}
