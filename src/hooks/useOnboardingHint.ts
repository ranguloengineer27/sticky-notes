import { useState } from 'react'
import { useDelayedFlag } from './useDelayedFlag'
import {
  EMPTY_CANVAS_HINT_MESSAGE,
  EXIT_EDITING_HINT_MESSAGE,
  EXIT_EDITING_HINT_VISIBLE_MS,
  ONBOARDING_HINT_MIN_VISIBLE_MS,
} from '../constants'

export interface OnboardingHintState {
  message: string
  isOpen: boolean
}

function getActiveMessage(
  isExitEditingHintOpen: boolean,
  isCreateNoteHintOpen: boolean,
): string | null {
  if (isExitEditingHintOpen) return EXIT_EDITING_HINT_MESSAGE
  if (isCreateNoteHintOpen) return EMPTY_CANVAS_HINT_MESSAGE
  return null
}

export function useOnboardingHint(
  hasNotes: boolean,
  isEditingNote: boolean,
): OnboardingHintState {
  const [wasInitiallyEmpty] = useState(!hasNotes)
  const hasCreateNoteMinDurationElapsed = useDelayedFlag(
    true,
    ONBOARDING_HINT_MIN_VISIBLE_MS,
  )
  const isCreateNoteHintOpen =
    !hasNotes || (wasInitiallyEmpty && !hasCreateNoteMinDurationElapsed)

  const [hasEnteredEditModeOnce, setHasEnteredEditModeOnce] = useState(false)
  if (isEditingNote && !hasEnteredEditModeOnce) {
    setHasEnteredEditModeOnce(true)
  }
  const hasExitEditingDurationElapsed = useDelayedFlag(
    hasEnteredEditModeOnce,
    EXIT_EDITING_HINT_VISIBLE_MS,
  )

  const [isExitEditingHintDismissed, setIsExitEditingHintDismissed] =
    useState(false)
  if (hasExitEditingDurationElapsed && !isExitEditingHintDismissed) {
    setIsExitEditingHintDismissed(true)
  }

  const isExitEditingHintOpen =
    hasEnteredEditModeOnce && !isExitEditingHintDismissed

  const activeMessage = getActiveMessage(
    isExitEditingHintOpen,
    isCreateNoteHintOpen,
  )

  const [message, setMessage] = useState(activeMessage ?? '')
  if (activeMessage !== null && activeMessage !== message) {
    setMessage(activeMessage)
  }

  return { message, isOpen: activeMessage !== null }
}
