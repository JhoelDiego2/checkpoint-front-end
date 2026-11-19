import { STATUS_OPTIONS, isValidCanonicalStatus } from './statusOptions'
import './catalog.css'

export default function StatusSelector({
  value = 'quero-jogar',
  onChange,
  disabled = false,
  id = 'game-status-select',
  label = 'Status na lista pessoal:',
}) {
  return (
    <div className="status-selector" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-h)' }}>
        {label}
      </label>
      <select
        id={id}
        value={isValidCanonicalStatus(value) ? value : 'quero-jogar'}
        onChange={(e) => {
          if (typeof onChange === 'function') {
            onChange(e.target.value)
          }
        }}
        disabled={disabled}
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
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
