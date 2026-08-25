import { describe, it, expect } from 'vitest'
import { computeConnectedNotePosition } from '../../utils/computeConnectedNotePosition'
import { buildNote } from '../testUtils'
import {
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  CONNECTION_NEW_NOTE_GAP_PX,
} from '../../constants'

describe('computeConnectedNotePosition', () => {
  const sourceNote = buildNote({
    position: { x: 100, y: 100, zIndex: 1 },
    size: { width: 200, height: 150 },
  })

  it('positions the note above the source, horizontally centered', () => {
    const position = computeConnectedNotePosition(sourceNote, 'top')

    expect(position).toEqual({
      x: 100 + 200 / 2 - DEFAULT_NOTE_WIDTH / 2,
      y: 100 - CONNECTION_NEW_NOTE_GAP_PX - DEFAULT_NOTE_HEIGHT,
    })
  })

  it('positions the note below the source, horizontally centered', () => {
    const position = computeConnectedNotePosition(sourceNote, 'bottom')

    expect(position).toEqual({
      x: 100 + 200 / 2 - DEFAULT_NOTE_WIDTH / 2,
      y: 100 + 150 + CONNECTION_NEW_NOTE_GAP_PX,
    })
  })

  it('positions the note to the left of the source, vertically centered', () => {
    const position = computeConnectedNotePosition(sourceNote, 'left')

    expect(position).toEqual({
      x: 100 - CONNECTION_NEW_NOTE_GAP_PX - DEFAULT_NOTE_WIDTH,
      y: 100 + 150 / 2 - DEFAULT_NOTE_HEIGHT / 2,
    })
  })

  it('positions the note to the right of the source, vertically centered', () => {
    const position = computeConnectedNotePosition(sourceNote, 'right')

    expect(position).toEqual({
      x: 100 + 200 + CONNECTION_NEW_NOTE_GAP_PX,
      y: 100 + 150 / 2 - DEFAULT_NOTE_HEIGHT / 2,
    })
  })
})
