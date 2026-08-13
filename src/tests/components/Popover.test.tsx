import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Popover } from '../../components/Popover/Popover'
import { POPOVER_EXIT_TRANSITION_MS } from '../../constants'

describe('Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the given message while open', () => {
    render(
      <Popover
        message="Double-click anywhere on the canvas to create a new note"
        isOpen
      />,
    )

    expect(
      screen.getByText(
        'Double-click anywhere on the canvas to create a new note',
      ),
    ).toBeInTheDocument()
  })

  it('announces the message to assistive technology', () => {
    render(<Popover message="Hint" isOpen />)

    expect(screen.getByRole('status')).toHaveTextContent('Hint')
  })

  it('does not render when closed from the start', () => {
    render(<Popover message="Hint" isOpen={false} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('stays in the document to play its exit transition before unmounting', () => {
    const { rerender } = render(<Popover message="Hint" isOpen />)

    rerender(<Popover message="Hint" isOpen={false} />)
    const popover = screen.getByRole('status')
    expect(popover).toBeInTheDocument()
    expect(popover.className).toMatch(/popoverClosing/)

    act(() => {
      vi.advanceTimersByTime(POPOVER_EXIT_TRANSITION_MS)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
