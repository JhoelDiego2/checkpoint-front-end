import { getInterfaceLabel, isValidCanonicalStatus } from './statusOptions'
import './catalog.css'

/**
 * Exibe o status atual de um jogo da lista pessoal usando o rótulo legível
 * definido em `statusOptions` (por exemplo, `quero-jogar` -> `quero jogar`).
 */
export default function GameStatusBadge({ status, className = '' }) {
  const hasValidStatus = isValidCanonicalStatus(status)
  const label = hasValidStatus ? getInterfaceLabel(status) : 'Status indisponível'
  const classes = [
    'catalog-status-badge',
    hasValidStatus ? '' : 'catalog-status-badge--unknown',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} data-status={hasValidStatus ? status : 'desconhecido'}>
      {label}
    </span>
  )
}
