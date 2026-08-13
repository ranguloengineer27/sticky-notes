import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../../components/Modal/Modal'

describe('Modal', () => {
  it('does not render its content when closed', () => {
    render(
      <Modal isOpen={false} ariaLabel="Example modal" onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders its content when open', () => {
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    )

    expect(
      screen.getByRole('dialog', { name: 'Example modal' }),
    ).toHaveTextContent('Content')
  })

  it('calls onClose when the escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking outside the dialog', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )

    fireEvent.pointerDown(document.body)

    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking inside the dialog', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )

    fireEvent.pointerDown(screen.getByText('Content'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('moves focus to the first focusable element when it opens', () => {
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>,
    )

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
  })

  it('falls back to focusing the dialog itself when it has no focusable content', () => {
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('traps forward tabbing from the last focusable element back to the first', () => {
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    )

    screen.getByRole('button', { name: 'Last' }).focus()
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
  })

  it('traps backward tabbing from the first focusable element to the last', () => {
    render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
  })

  it('restores focus to the previously focused element when it closes', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open modal'
    document.body.appendChild(trigger)
    trigger.focus()

    const { rerender } = render(
      <Modal isOpen ariaLabel="Example modal" onClose={vi.fn()}>
        <button type="button">Inside</button>
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus()

    rerender(
      <Modal isOpen={false} ariaLabel="Example modal" onClose={vi.fn()}>
        <button type="button">Inside</button>
      </Modal>,
    )

    expect(trigger).toHaveFocus()
    document.body.removeChild(trigger)
  })
})
