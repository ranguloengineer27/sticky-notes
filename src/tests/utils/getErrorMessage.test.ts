import { describe, it, expect } from 'vitest'
import { getErrorMessage } from '../../utils/getErrorMessage'

describe('getErrorMessage', () => {
  it('returns the message of an Error instance', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('stringifies non-Error values', () => {
    expect(getErrorMessage('boom')).toBe('boom')
    expect(getErrorMessage(404)).toBe('404')
  })
})
