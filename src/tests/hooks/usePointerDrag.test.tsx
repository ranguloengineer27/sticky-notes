import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { usePointerDrag } from '../../hooks/usePointerDrag'

interface DragTargetProps {
  onMove: (deltaX: number, deltaY: number) => void
  onEnd: () => void
}

function DragTarget({ onMove, onEnd }: DragTargetProps) {
  const handlers = usePointerDrag({ onMove, onEnd })
  return <div data-testid="drag-target" {...handlers} />
}

describe('usePointerDrag', () => {
  it('reports movement deltas relative to the pointer-down position', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(onMove).toHaveBeenCalledWith(30, -10, expect.anything())
  })

  it('calls onEnd when the pointer is released', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerUp(target, { pointerId: 1, clientX: 10, clientY: 10 })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('ignores pointermove events before a pointerdown', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerMove(target, { pointerId: 1, clientX: 30, clientY: 30 })

    expect(onMove).not.toHaveBeenCalled()
  })

  it('ignores events from a different pointer than the one that started the drag', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(target, { pointerId: 2, clientX: 50, clientY: 50 })

    expect(onMove).not.toHaveBeenCalled()
  })

  it('ignores pointermove events after the pointer has already been released', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerUp(target, { pointerId: 1, clientX: 10, clientY: 10 })
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 50, clientY: 50 })

    expect(onMove).not.toHaveBeenCalled()
  })

  it('keeps reporting movement even when it jumps straight past the target element', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 100, clientY: 100 })
    // A large, single-step movement whose target is a completely unrelated
    // element (e.g. the cursor lands far away from where the drag started,
    // as a fast real drag or a large synthetic move can do).
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 500,
      clientY: 600,
    })

    expect(onMove).toHaveBeenCalledWith(400, 500, expect.anything())
  })

  it('still ends the drag when pointerup fires on an unrelated element', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId } = render(<DragTarget onMove={onMove} onEnd={onEnd} />)
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 0, clientY: 0 })
    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('stops listening for move/up once unmounted', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { getByTestId, unmount } = render(
      <DragTarget onMove={onMove} onEnd={onEnd} />,
    )
    const target = getByTestId('drag-target')

    fireEvent.pointerDown(target, { pointerId: 1, clientX: 0, clientY: 0 })
    unmount()
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 50,
      clientY: 50,
    })

    expect(onMove).not.toHaveBeenCalled()
  })
})
