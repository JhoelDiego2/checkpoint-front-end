import { UI_MESSAGES } from './uiMessages'

export default function EmptyState({ message = UI_MESSAGES.empty.catalog }) {
  return (
    <div role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  )
}
