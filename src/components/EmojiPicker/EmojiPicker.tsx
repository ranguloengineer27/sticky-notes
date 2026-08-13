import { useEffect, useRef, useState } from 'react'
import type { Emoji } from '../../types/note'
import {
  EMOJI_OPTIONS,
  EMOJI_PICKER_PANEL_GAP_PX,
  EMOJI_PICKER_PANEL_LABEL,
  EMOJI_PICKER_TOGGLE_LABEL,
} from '../../constants'
import { useClickOutside } from '../../hooks/useClickOutside'
import styles from './EmojiPicker.module.scss'

export interface EmojiPickerProps {
  onSelect: (emoji: Emoji) => void
}

interface PanelPosition {
  top: number
  right: number
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  useClickOutside(containerRef, () => setIsOpen(false))

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      toggleButtonRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function handleToggleClick(): void {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    const toggleRect = toggleButtonRef.current?.getBoundingClientRect()
    if (toggleRect) {
      setPanelPosition({
        top: toggleRect.bottom + EMOJI_PICKER_PANEL_GAP_PX,
        right: window.innerWidth - toggleRect.right,
      })
    }
    setIsOpen(true)
  }

  function handleEmojiClick(emoji: Emoji): void {
    onSelect(emoji)
    setIsOpen(false)
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={toggleButtonRef}
        type="button"
        className={styles.toggleButton}
        aria-label={EMOJI_PICKER_TOGGLE_LABEL}
        aria-expanded={isOpen}
        onClick={handleToggleClick}
      >
        🙂
      </button>
      {isOpen && panelPosition && (
        <div
          className={styles.panel}
          role="group"
          aria-label={EMOJI_PICKER_PANEL_LABEL}
          style={{ top: panelPosition.top, right: panelPosition.right }}
        >
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={styles.emojiOption}
              aria-label={`Insert ${emoji} emoji`}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
