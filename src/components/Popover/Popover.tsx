import { useEffect, useState } from 'react'
import { POPOVER_EXIT_TRANSITION_MS } from '../../constants'
import styles from './Popover.module.scss'

export interface PopoverProps {
  message: string
  isOpen: boolean
}

export function Popover({ message, isOpen }: PopoverProps) {
  const [isRendered, setIsRendered] = useState(isOpen)

  if (isOpen && !isRendered) {
    setIsRendered(true)
  }

  useEffect(() => {
    if (isOpen) return

    const timeoutId = window.setTimeout(() => {
      setIsRendered(false)
    }, POPOVER_EXIT_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen])

  if (!isRendered) {
    return null
  }

  const className = isOpen
    ? styles.popover
    : `${styles.popover} ${styles.popoverClosing}`

  return (
    <div className={className} role="status" aria-live="polite">
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 9l5.6 13 1.8-5.6L22 14.6 9 9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 2v3M2 7h3M4 4l1.8 1.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
