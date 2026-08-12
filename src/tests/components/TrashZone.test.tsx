import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrashZone } from '../../components/TrashZone/TrashZone'

describe('TrashZone', () => {
  it('renders without the active styling by default', () => {
    render(<TrashZone isActive={false} />)

    const trashZone = screen.getByRole('img', { name: 'Trash zone' })
    expect(trashZone.className).not.toMatch(/trashZoneActive/)
  })

  it('applies the active styling when a note is being dragged over it', () => {
    render(<TrashZone isActive />)

    const trashZone = screen.getByRole('img', { name: 'Trash zone' })
    expect(trashZone.className).toMatch(/trashZoneActive/)
  })
})
