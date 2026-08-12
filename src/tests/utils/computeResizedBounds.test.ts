import { describe, it, expect } from 'vitest'
import { computeResizedBounds } from '../../utils/computeResizedBounds'
import type { ResizeBounds } from '../../types/note'

const origin: ResizeBounds = { x: 100, y: 100, width: 200, height: 150 }

describe('computeResizedBounds', () => {
  it('grows from the bottom-right corner without moving the origin', () => {
    expect(computeResizedBounds('bottom-right', origin, 20, 10)).toEqual({
      x: 100,
      y: 100,
      width: 220,
      height: 160,
    })
  })

  it('moves the left edge and keeps the top when resizing from the bottom-left', () => {
    expect(computeResizedBounds('bottom-left', origin, 20, 10)).toEqual({
      x: 120,
      y: 100,
      width: 180,
      height: 160,
    })
  })

  it('moves the top edge and keeps the left when resizing from the top-right', () => {
    expect(computeResizedBounds('top-right', origin, 20, 10)).toEqual({
      x: 100,
      y: 110,
      width: 220,
      height: 140,
    })
  })

  it('moves both the top and left edges when resizing from the top-left', () => {
    expect(computeResizedBounds('top-left', origin, 20, 10)).toEqual({
      x: 120,
      y: 110,
      width: 180,
      height: 140,
    })
  })
})
