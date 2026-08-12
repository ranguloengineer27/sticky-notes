import { describe, it, expect } from 'vitest'
import { clampNoteSize } from '../../utils/clampNoteSize'
import { MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '../../constants'

describe('clampNoteSize', () => {
  it('returns the size unchanged when above the minimums', () => {
    const size = { width: MIN_NOTE_WIDTH + 50, height: MIN_NOTE_HEIGHT + 50 }

    expect(clampNoteSize(size)).toEqual(size)
  })

  it('raises width up to the minimum when below it', () => {
    const size = { width: MIN_NOTE_WIDTH - 10, height: MIN_NOTE_HEIGHT + 50 }

    expect(clampNoteSize(size).width).toBe(MIN_NOTE_WIDTH)
  })

  it('raises height up to the minimum when below it', () => {
    const size = { width: MIN_NOTE_WIDTH + 50, height: MIN_NOTE_HEIGHT - 10 }

    expect(clampNoteSize(size).height).toBe(MIN_NOTE_HEIGHT)
  })

  it('clamps both dimensions to the minimums at once', () => {
    const size = { width: 0, height: 0 }

    expect(clampNoteSize(size)).toEqual({
      width: MIN_NOTE_WIDTH,
      height: MIN_NOTE_HEIGHT,
    })
  })
})
