import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal/DeleteConfirmationModal'

function renderModal(
  overrides: Partial<Parameters<typeof DeleteConfirmationModal>[0]> = {},
) {
  const props = {
    isOpen: true,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
    ...overrides,
  }
  render(<DeleteConfirmationModal {...props} />)
  return props
}

describe('DeleteConfirmationModal', () => {
  it('is not shown when closed', () => {
    renderModal({ isOpen: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the confirmation message and both actions when open', () => {
    renderModal()

    expect(
      screen.getByText(
        'Are you sure you want to delete this note? This is a permanent action.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onCancel without a preference when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(props.onCancel).toHaveBeenCalled()
    expect(props.onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm with false when Delete is clicked without checking the box', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(props.onConfirm).toHaveBeenCalledWith(false)
  })

  it('calls onConfirm with true when the "don\'t show again" box is checked before deleting', async () => {
    const user = userEvent.setup()
    const props = renderModal()

    await user.click(
      screen.getByRole('checkbox', {
        name: "Don't show me this message again",
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(props.onConfirm).toHaveBeenCalledWith(true)
  })

  it('calls onCancel without confirming when closed via the escape key', () => {
    const props = renderModal()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(props.onCancel).toHaveBeenCalled()
    expect(props.onConfirm).not.toHaveBeenCalled()
  })

  it('resets the checkbox after being reopened once cancelled', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const { rerender } = render(
      <DeleteConfirmationModal
        isOpen
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    await user.click(
      screen.getByRole('checkbox', {
        name: "Don't show me this message again",
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    rerender(
      <DeleteConfirmationModal
        isOpen
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(
      screen.getByRole('checkbox', {
        name: "Don't show me this message again",
      }),
    ).not.toBeChecked()
  })
})
