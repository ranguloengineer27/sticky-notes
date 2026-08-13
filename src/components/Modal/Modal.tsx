import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import styles from './Modal.module.scss'

export interface ModalProps {
  isOpen: boolean
  ariaLabel: string
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

export function Modal({ isOpen, ariaLabel, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  useClickOutside(dialogRef, () => {
    if (!isOpen) return
    onClose()
  })

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const dialog = dialogRef.current
    const firstFocusableElement = dialog
      ? getFocusableElements(dialog)[0]
      : undefined
    ;(firstFocusableElement ?? dialog)?.focus()

    return () => {
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = getFocusableElements(dialogRef.current)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )
}
