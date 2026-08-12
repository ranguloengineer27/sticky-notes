import { describe, it, expect } from 'vitest'
import { getNextZIndex } from '../../utils/getNextZIndex'
import { buildNote } from '../testUtils'

describe('getNextZIndex', () => {
  it('returns 1 when there are no notes', () => {
    expect(getNextZIndex([])).toBe(1)
  })

  it('returns one above the highest existing zIndex', () => {
    const notes = [
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 1 } }),
      buildNote({ id: 'b', position: { x: 0, y: 0, zIndex: 5 } }),
      buildNote({ id: 'c', position: { x: 0, y: 0, zIndex: 3 } }),
    ]

    expect(getNextZIndex(notes)).toBe(6)
  })
})
