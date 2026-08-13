import { describe, it, expect } from 'vitest'
import { insertTextAtSelection } from '../../utils/insertTextAtSelection'

describe('insertTextAtSelection', () => {
  it('inserts the text at the given caret position', () => {
    expect(insertTextAtSelection('Hello world', '🎉', 5, 5)).toBe(
      'Hello🎉 world',
    )
  })

  it('replaces the selected range with the inserted text', () => {
    expect(insertTextAtSelection('Hello world', '🎉', 6, 11)).toBe('Hello 🎉')
  })

  it('appends the text when the caret is at the end', () => {
    expect(insertTextAtSelection('Hello', '🎉', 5, 5)).toBe('Hello🎉')
  })
})
