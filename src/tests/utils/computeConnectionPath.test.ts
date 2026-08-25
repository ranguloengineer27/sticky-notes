import { describe, it, expect } from 'vitest'
import { computeConnectionPath } from '../../utils/computeConnectionPath'
import { buildNote } from '../testUtils'

describe('computeConnectionPath', () => {
  it('draws the line from the right edge of the source to the left edge of the target when the target is to the right', () => {
    const sourceNote = buildNote({
      position: { x: 0, y: 0, zIndex: 1 },
      size: { width: 100, height: 100 },
    })
    const targetNote = buildNote({
      position: { x: 300, y: 0, zIndex: 1 },
      size: { width: 100, height: 100 },
    })

    const path = computeConnectionPath(sourceNote, targetNote)

    expect(path).toEqual({ x1: 100, y1: 50, x2: 300, y2: 50 })
  })

  it('draws the line from the bottom edge of the source to the top edge of the target when the target is below', () => {
    const sourceNote = buildNote({
      position: { x: 0, y: 0, zIndex: 1 },
      size: { width: 100, height: 100 },
    })
    const targetNote = buildNote({
      position: { x: 0, y: 300, zIndex: 1 },
      size: { width: 100, height: 100 },
    })

    const path = computeConnectionPath(sourceNote, targetNote)

    expect(path).toEqual({ x1: 50, y1: 100, x2: 50, y2: 300 })
  })

  it('clips the endpoints to the note borders when the notes are diagonally offset', () => {
    const sourceNote = buildNote({
      position: { x: 0, y: 0, zIndex: 1 },
      size: { width: 100, height: 100 },
    })
    const targetNote = buildNote({
      position: { x: 200, y: 200, zIndex: 1 },
      size: { width: 100, height: 100 },
    })

    const path = computeConnectionPath(sourceNote, targetNote)

    expect(path.x1).toBeGreaterThanOrEqual(0)
    expect(path.x1).toBeLessThanOrEqual(100)
    expect(path.y1).toBeGreaterThanOrEqual(0)
    expect(path.y1).toBeLessThanOrEqual(100)
    expect(path.x2).toBeGreaterThanOrEqual(200)
    expect(path.x2).toBeLessThanOrEqual(300)
    expect(path.y2).toBeGreaterThanOrEqual(200)
    expect(path.y2).toBeLessThanOrEqual(300)
  })
})
