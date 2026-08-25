import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadConnections,
  saveConnections,
} from '../../services/connectionsService'
import { CONNECTIONS_STORAGE_KEY } from '../../constants'
import { buildConnection } from '../testUtils'

beforeEach(() => {
  localStorage.clear()
})

describe('loadConnections', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadConnections()).toEqual([])
  })

  it('returns previously saved connections', () => {
    const connections = [buildConnection()]
    saveConnections(connections)

    expect(loadConnections()).toEqual(connections)
  })

  it('throws a semantic error when the stored value is not valid JSON', () => {
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, '{not valid json')

    expect(() => loadConnections()).toThrow(
      /Failed to load connections from localStorage/,
    )
  })
})

describe('saveConnections', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws a semantic error when localStorage.setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => saveConnections([buildConnection()])).toThrow(
      /Failed to save 1 connection\(s\) to localStorage/,
    )
  })
})
