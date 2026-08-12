import { describe, it, expect } from 'vitest'
import { clampNotePosition } from '../../utils/clampNotePosition'

describe('clampNotePosition', () => {
  it('leaves the position unchanged when the note is fully within the canvas', () => {
    const position = clampNotePosition(
      { x: 100, y: 80 },
      { width: 200, height: 150 },
      { width: 1000, height: 800 },
    )

    expect(position).toEqual({ x: 100, y: 80 })
  })

  it('clamps a negative position to the top-left canvas edge', () => {
    const position = clampNotePosition(
      { x: -300, y: -200 },
      { width: 200, height: 150 },
      { width: 1000, height: 800 },
    )

    expect(position).toEqual({ x: 0, y: 0 })
  })

  it('clamps a position beyond the canvas to keep the note fully visible', () => {
    const position = clampNotePosition(
      { x: 5000, y: 4000 },
      { width: 200, height: 150 },
      { width: 1000, height: 800 },
    )

    expect(position).toEqual({ x: 800, y: 650 })
  })

  it('clamps to the canvas origin when the note is larger than the canvas', () => {
    const position = clampNotePosition(
      { x: -50, y: -50 },
      { width: 1200, height: 900 },
      { width: 1000, height: 800 },
    )

    expect(position).toEqual({ x: 0, y: 0 })
  })
})
