import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  shouldSkipDeleteConfirmation,
  skipDeleteConfirmation,
} from '../../services/deleteConfirmationService'
import { SKIP_DELETE_CONFIRMATION_STORAGE_KEY } from '../../constants'

beforeEach(() => {
  sessionStorage.clear()
})

describe('shouldSkipDeleteConfirmation', () => {
  it('returns false when no preference has been stored', () => {
    expect(shouldSkipDeleteConfirmation()).toBe(false)
  })

  it('returns true once the preference has been stored', () => {
    skipDeleteConfirmation()

    expect(shouldSkipDeleteConfirmation()).toBe(true)
  })

  it('throws a semantic error when sessionStorage.getItem fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('unavailable')
    })

    expect(() => shouldSkipDeleteConfirmation()).toThrow(
      /Failed to read delete confirmation preference from sessionStorage/,
    )

    vi.restoreAllMocks()
  })
})

describe('skipDeleteConfirmation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stores the preference in sessionStorage', () => {
    skipDeleteConfirmation()

    expect(sessionStorage.getItem(SKIP_DELETE_CONFIRMATION_STORAGE_KEY)).toBe(
      'true',
    )
  })

  it('throws a semantic error when sessionStorage.setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => skipDeleteConfirmation()).toThrow(
      /Failed to save delete confirmation preference to sessionStorage/,
    )
  })
})
