import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadNotes,
  saveNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../../services/notesService'
import {
  STORAGE_KEY,
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_COLOR,
} from '../../constants'
import { buildNote } from '../testUtils'

beforeEach(() => {
  localStorage.clear()
})

describe('loadNotes', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadNotes()).toEqual([])
  })

  it('returns previously saved notes', () => {
    const notes = [buildNote()]
    saveNotes(notes)

    expect(loadNotes()).toEqual(notes)
  })

  it('throws a semantic error when the stored value is not valid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json')

    expect(() => loadNotes()).toThrow(/Failed to load notes from localStorage/)
  })
})

describe('saveNotes', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws a semantic error when localStorage.setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => saveNotes([buildNote()])).toThrow(
      /Failed to save 1 note\(s\) to localStorage/,
    )
  })
})

describe('createNote', () => {
  it('creates a note with default size and color at the given position', () => {
    const { notes, note } = createNote([], 50, 60)

    expect(note.position).toEqual({ x: 50, y: 60, zIndex: 1 })
    expect(note.size).toEqual({
      width: DEFAULT_NOTE_WIDTH,
      height: DEFAULT_NOTE_HEIGHT,
    })
    expect(note.color).toBe(DEFAULT_NOTE_COLOR)
    expect(note.content).toEqual({ title: '', description: '' })
    expect(notes).toEqual([note])
  })

  it('assigns a zIndex above every existing note', () => {
    const existing = [
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 3 } }),
    ]

    const { note } = createNote(existing, 0, 0)

    expect(note.position.zIndex).toBe(4)
  })

  it('does not mutate the input array', () => {
    const existing = [buildNote()]

    createNote(existing, 0, 0)

    expect(existing).toHaveLength(1)
  })
})

describe('updateNote', () => {
  it('merges the given changes into the matching note', () => {
    const notes = [buildNote({ id: 'a' }), buildNote({ id: 'b' })]

    const result = updateNote(notes, 'a', {
      content: { title: 'New', description: 'New body' },
    })

    expect(result.find((note) => note.id === 'a')?.content).toEqual({
      title: 'New',
      description: 'New body',
    })
    expect(result.find((note) => note.id === 'b')).toEqual(notes[1])
  })

  it('returns the array unchanged when the id does not match any note', () => {
    const notes = [buildNote({ id: 'a' })]

    const result = updateNote(notes, 'missing', { color: DEFAULT_NOTE_COLOR })

    expect(result).toEqual(notes)
  })
})

describe('deleteNote', () => {
  it('removes the note with the matching id', () => {
    const notes = [buildNote({ id: 'a' }), buildNote({ id: 'b' })]

    const result = deleteNote(notes, 'a')

    expect(result).toEqual([notes[1]])
  })

  it('returns the array unchanged when the id does not match any note', () => {
    const notes = [buildNote({ id: 'a' })]

    const result = deleteNote(notes, 'missing')

    expect(result).toEqual(notes)
  })
})
