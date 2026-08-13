import { useState } from 'react'
import { Modal } from '../Modal/Modal'
import {
  DELETE_CONFIRMATION_MESSAGE,
  DONT_SHOW_DELETE_CONFIRMATION_AGAIN_LABEL,
  CANCEL_DELETE_LABEL,
  CONFIRM_DELETE_LABEL,
} from '../../constants'
import styles from './DeleteConfirmationModal.module.scss'

export interface DeleteConfirmationModalProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: (dontShowAgain: boolean) => void
}

export function DeleteConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  function handleCancel(): void {
    setDontShowAgain(false)
    onCancel()
  }

  function handleConfirm(): void {
    onConfirm(dontShowAgain)
    setDontShowAgain(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      ariaLabel="Delete note confirmation"
      onClose={handleCancel}
    >
      <p className={styles.message}>{DELETE_CONFIRMATION_MESSAGE}</p>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={dontShowAgain}
          onChange={(event) => setDontShowAgain(event.target.checked)}
        />
        {DONT_SHOW_DELETE_CONFIRMATION_AGAIN_LABEL}
      </label>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          {CANCEL_DELETE_LABEL}
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleConfirm}
        >
          {CONFIRM_DELETE_LABEL}
        </button>
      </div>
    </Modal>
  )
}
