import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StickyNoteMenu } from '../../components/StickyNoteMenu/StickyNoteMenu'

function renderStickyNoteMenu(
  overrides: Partial<Parameters<typeof StickyNoteMenu>[0]> = {},
) {
  const props = {
    color: '#DE7373' as const,
    shape: 'square' as const,
    onColorChange: vi.fn(),
    onShapeChange: vi.fn(),
    ...overrides,
  }
  render(<StickyNoteMenu {...props} />)
  return props
}

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Note options' }))
}

function openColorOptions() {
  openMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Change note color' }))
}

function openShapeOptions() {
  openMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Change note shape' }))
}

describe('StickyNoteMenu', () => {
  it('does not render the panel until the trigger is clicked', () => {
    renderStickyNoteMenu()

    expect(
      screen.queryByRole('group', { name: 'Note options menu' }),
    ).not.toBeInTheDocument()
  })

  it('opens the panel when the trigger is clicked', () => {
    renderStickyNoteMenu()

    openMenu()

    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Note options' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('shows only the current color chip until it is expanded', () => {
    renderStickyNoteMenu({ color: '#87E6AC' })

    openMenu()

    expect(
      screen.getByRole('button', { name: 'Change note color' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('group', { name: 'Color picker' }),
    ).not.toBeInTheDocument()
  })

  it('expands the color options when the color chip is clicked', () => {
    renderStickyNoteMenu({ color: '#87E6AC' })

    openColorOptions()

    expect(
      screen.getByRole('group', { name: 'Color picker' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Set note color to #87E6AC' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'Set note color to #DE7373' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the selected color, collapses the row, and keeps the panel open', () => {
    const props = renderStickyNoteMenu({ color: '#DE7373' })

    openColorOptions()
    fireEvent.click(
      screen.getByRole('button', { name: 'Set note color to #87E6AC' }),
    )

    expect(props.onColorChange).toHaveBeenCalledWith('#87E6AC')
    expect(
      screen.queryByRole('group', { name: 'Color picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
  })

  it('closes only the color popover on the first Escape and returns focus to the chip', () => {
    renderStickyNoteMenu()

    openColorOptions()
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(
      screen.queryByRole('group', { name: 'Color picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change note color' }),
    ).toHaveFocus()
  })

  it('closes the whole panel on a second Escape and returns focus to the trigger', () => {
    renderStickyNoteMenu()

    openColorOptions()
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(
      screen.queryByRole('group', { name: 'Note options menu' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Note options' })).toHaveFocus()
  })

  it('collapses just the color row when a pointer goes down inside the panel but outside the color options', () => {
    renderStickyNoteMenu()

    openColorOptions()
    fireEvent.pointerDown(
      screen.getByRole('group', { name: 'Note options menu' }),
    )

    expect(
      screen.queryByRole('group', { name: 'Color picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
  })

  it('closes the whole panel when a pointer goes down outside the menu', () => {
    renderStickyNoteMenu()

    openMenu()
    fireEvent.pointerDown(document.body)

    expect(
      screen.queryByRole('group', { name: 'Note options menu' }),
    ).not.toBeInTheDocument()
  })

  it('shows only the current shape chip until it is expanded', () => {
    renderStickyNoteMenu({ shape: 'circle' })

    openMenu()

    expect(
      screen.getByRole('button', { name: 'Change note shape' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('group', { name: 'Shape picker' }),
    ).not.toBeInTheDocument()
  })

  it('expands the shape options when the shape chip is clicked', () => {
    renderStickyNoteMenu({ shape: 'circle' })

    openShapeOptions()

    expect(
      screen.getByRole('group', { name: 'Shape picker' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Set note shape to circle' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'Set note shape to square' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the selected shape, collapses the row, and keeps the panel open', () => {
    const props = renderStickyNoteMenu({ shape: 'square' })

    openShapeOptions()
    fireEvent.click(
      screen.getByRole('button', { name: 'Set note shape to triangle' }),
    )

    expect(props.onShapeChange).toHaveBeenCalledWith('triangle')
    expect(
      screen.queryByRole('group', { name: 'Shape picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
  })

  it('closes the color options when the shape row is expanded (accordion)', () => {
    renderStickyNoteMenu()

    openColorOptions()
    fireEvent.click(screen.getByRole('button', { name: 'Change note shape' }))

    expect(
      screen.queryByRole('group', { name: 'Color picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Shape picker' }),
    ).toBeInTheDocument()
  })

  it('closes the shape options when the color row is expanded (accordion)', () => {
    renderStickyNoteMenu()

    openShapeOptions()
    fireEvent.click(screen.getByRole('button', { name: 'Change note color' }))

    expect(
      screen.queryByRole('group', { name: 'Shape picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Color picker' }),
    ).toBeInTheDocument()
  })

  it('closes only the shape popover on the first Escape and returns focus to the chip', () => {
    renderStickyNoteMenu()

    openShapeOptions()
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(
      screen.queryByRole('group', { name: 'Shape picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change note shape' }),
    ).toHaveFocus()
  })

  it('collapses just the shape row when a pointer goes down inside the panel but outside the shape options', () => {
    renderStickyNoteMenu()

    openShapeOptions()
    fireEvent.pointerDown(
      screen.getByRole('group', { name: 'Note options menu' }),
    )

    expect(
      screen.queryByRole('group', { name: 'Shape picker' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Note options menu' }),
    ).toBeInTheDocument()
  })
})
