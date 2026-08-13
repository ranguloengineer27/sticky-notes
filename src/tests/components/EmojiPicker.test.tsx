import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmojiPicker } from '../../components/EmojiPicker/EmojiPicker'
import { EMOJI_OPTIONS } from '../../constants'

describe('EmojiPicker', () => {
  it('does not show the emoji options until toggled open', () => {
    render(<EmojiPicker onSelect={vi.fn()} />)

    expect(
      screen.queryByRole('group', { name: 'Emoji picker' }),
    ).not.toBeInTheDocument()
  })

  it('shows the emoji options when the toggle button is clicked', () => {
    render(<EmojiPicker onSelect={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))

    expect(
      screen.getByRole('group', { name: 'Emoji picker' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /^Insert .+ emoji$/ }),
    ).toHaveLength(EMOJI_OPTIONS.length)
  })

  it('reports the selected emoji and closes the panel', () => {
    const onSelect = vi.fn()
    render(<EmojiPicker onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))
    fireEvent.click(
      screen.getByRole('button', {
        name: `Insert ${EMOJI_OPTIONS[0]} emoji`,
      }),
    )

    expect(onSelect).toHaveBeenCalledWith(EMOJI_OPTIONS[0])
    expect(
      screen.queryByRole('group', { name: 'Emoji picker' }),
    ).not.toBeInTheDocument()
  })

  it('closes the panel when a pointer goes down outside of it', () => {
    render(<EmojiPicker onSelect={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))
    fireEvent.pointerDown(document.body)

    expect(
      screen.queryByRole('group', { name: 'Emoji picker' }),
    ).not.toBeInTheDocument()
  })

  it('closes the panel and returns focus to the toggle when Escape is pressed', () => {
    render(<EmojiPicker onSelect={vi.fn()} />)
    const toggleButton = screen.getByRole('button', { name: 'Insert emoji' })

    fireEvent.click(toggleButton)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(
      screen.queryByRole('group', { name: 'Emoji picker' }),
    ).not.toBeInTheDocument()
    expect(toggleButton).toHaveFocus()
  })

  it('moves focus from the toggle to the first emoji option when tabbing forward', async () => {
    const user = userEvent.setup()
    render(<EmojiPicker onSelect={vi.fn()} />)
    const toggleButton = screen.getByRole('button', { name: 'Insert emoji' })

    toggleButton.focus()
    fireEvent.click(toggleButton)
    await user.tab()

    expect(
      screen.getByRole('button', { name: `Insert ${EMOJI_OPTIONS[0]} emoji` }),
    ).toHaveFocus()
  })
})
