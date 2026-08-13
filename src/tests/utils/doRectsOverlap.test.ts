import { describe, it, expect } from 'vitest'
import { doRectsOverlap } from '../../utils/doRectsOverlap'

const rect = { left: 100, top: 100, right: 200, bottom: 150 }

describe('doRectsOverlap', () => {
  it('returns true when the rects overlap', () => {
    expect(
      doRectsOverlap(rect, { left: 150, top: 120, right: 250, bottom: 170 }),
    ).toBe(true)
  })

  it('returns true when one rect fully contains the other', () => {
    expect(
      doRectsOverlap(rect, { left: 0, top: 0, right: 300, bottom: 300 }),
    ).toBe(true)
  })

  it('returns true when the rects only touch at an edge', () => {
    expect(
      doRectsOverlap(rect, { left: 200, top: 100, right: 250, bottom: 150 }),
    ).toBe(true)
  })

  it('returns false when the rects do not overlap', () => {
    expect(
      doRectsOverlap(rect, { left: 300, top: 300, right: 350, bottom: 350 }),
    ).toBe(false)
  })
})
