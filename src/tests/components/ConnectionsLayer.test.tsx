import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionsLayer } from '../../components/ConnectionsLayer/ConnectionsLayer'
import { buildNote, buildConnection } from '../testUtils'

describe('ConnectionsLayer', () => {
  it('renders an arrow between the source and target notes of each connection', () => {
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 0, y: 0, zIndex: 1 },
        size: { width: 100, height: 100 },
      }),
      buildNote({
        id: 'b',
        position: { x: 300, y: 0, zIndex: 1 },
        size: { width: 100, height: 100 },
      }),
    ]
    const connections = [
      buildConnection({
        id: 'connection-1',
        sourceNoteId: 'a',
        targetNoteId: 'b',
      }),
    ]

    render(<ConnectionsLayer notes={notes} connections={connections} />)

    const arrow = screen.getByTestId('connection-arrow-connection-1')
    expect(arrow).toHaveAttribute('x1', '100')
    expect(arrow).toHaveAttribute('x2', '300')
  })

  it('skips connections whose source or target note no longer exists', () => {
    const notes = [buildNote({ id: 'a' })]
    const connections = [
      buildConnection({
        id: 'connection-1',
        sourceNoteId: 'a',
        targetNoteId: 'missing',
      }),
    ]

    render(<ConnectionsLayer notes={notes} connections={connections} />)

    expect(
      screen.queryByTestId('connection-arrow-connection-1'),
    ).not.toBeInTheDocument()
  })
})
