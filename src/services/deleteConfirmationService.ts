import { SKIP_DELETE_CONFIRMATION_STORAGE_KEY } from '../constants'
import { getErrorMessage } from '../utils/getErrorMessage'

export function shouldSkipDeleteConfirmation(): boolean {
  try {
    return (
      sessionStorage.getItem(SKIP_DELETE_CONFIRMATION_STORAGE_KEY) === 'true'
    )
  } catch (error) {
    throw new Error(
      `Failed to read delete confirmation preference from sessionStorage: ${getErrorMessage(error)}`,
    )
  }
}

export function skipDeleteConfirmation(): void {
  try {
    sessionStorage.setItem(SKIP_DELETE_CONFIRMATION_STORAGE_KEY, 'true')
  } catch (error) {
    throw new Error(
      `Failed to save delete confirmation preference to sessionStorage: ${getErrorMessage(error)}`,
    )
  }
}
