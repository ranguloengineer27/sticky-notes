import { useState } from 'react'
import type { RefObject } from 'react'
import { useClickOutside } from './useClickOutside'
import { useEscapeKey } from './useEscapeKey'

export interface UseTogglePopoverResult {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export interface UseTogglePopoverOptions {
  suppressEscape?: boolean
}

export function useTogglePopover<
  TContainer extends HTMLElement,
  TTrigger extends HTMLElement,
>(
  containerRef: RefObject<TContainer | null>,
  triggerRef: RefObject<TTrigger | null>,
  { suppressEscape = false }: UseTogglePopoverOptions = {},
): UseTogglePopoverResult {
  const [isOpen, setIsOpen] = useState(false)

  function close(): void {
    setIsOpen(false)
  }

  useClickOutside(containerRef, close)

  useEscapeKey(isOpen && !suppressEscape, () => {
    close()
    triggerRef.current?.focus()
  })

  return {
    isOpen,
    open: () => setIsOpen(true),
    close,
    toggle: () => setIsOpen((currentIsOpen) => !currentIsOpen),
  }
}
