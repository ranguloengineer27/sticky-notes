import { describe, it, expect } from 'vitest'
import { isPointInRect } from '../../utils/isPointInRect'

const rect = { left: 100, top: 100, right: 200, bottom: 150 }

describe('isPointInRect', () => {
  it('returns true for a point inside the rect', () => {
    expect(isPointInRect(150, 120, rect)).toBe(true)
  })

  it('returns true for a point exactly on the rect edges', () => {
    expect(isPointInRect(100, 100, rect)).toBe(true)
    expect(isPointInRect(200, 150, rect)).toBe(true)
  })

  it('returns false for a point outside the rect', () => {
    expect(isPointInRect(50, 120, rect)).toBe(false)
    expect(isPointInRect(150, 200, rect)).toBe(false)
  })
})
