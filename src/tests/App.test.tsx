import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { App } from '../App'
import * as notesService from '../services/notesService'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([])
    vi.spyOn(notesService, 'saveNotes').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders the canvas without crashing', () => {
    const { container } = render(<App />)

    expect(container.firstChild).not.toBeNull()
  })
})
