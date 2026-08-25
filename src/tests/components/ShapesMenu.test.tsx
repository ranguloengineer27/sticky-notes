import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShapesMenu } from '../../components/ShapesMenu/ShapesMenu'
import { SHAPES } from '../../constants'

describe('ShapesMenu', () => {
  it('renders an option for every available shape', () => {
    render(<ShapesMenu shape="square" onSelect={vi.fn()} />)

    expect(
      screen.getAllByRole('button', { name: /^Set note shape to .+$/ }),
    ).toHaveLength(SHAPES.length)
  })

  it('marks the current shape as selected', () => {
    render(<ShapesMenu shape="circle" onSelect={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Set note shape to circle' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'Set note shape to square' }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByRole('button', { name: 'Set note shape to triangle' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the selected shape', () => {
    const onSelect = vi.fn()
    render(<ShapesMenu shape="square" onSelect={onSelect} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Set note shape to triangle' }),
    )

    expect(onSelect).toHaveBeenCalledWith('triangle')
  })
})
