import type { Ref } from 'react'
import styles from './TrashZone.module.scss'

export interface TrashZoneProps {
  isActive: boolean
  ref?: Ref<HTMLDivElement>
}

export function TrashZone({ isActive, ref }: TrashZoneProps) {
  const className = isActive
    ? `${styles.trashZone} ${styles.trashZoneActive}`
    : styles.trashZone

  return (
    <div ref={ref} className={className} aria-label="Trash zone" role="img">
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
