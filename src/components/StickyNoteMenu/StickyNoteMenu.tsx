import { useRef } from 'react'
import type { NoteColor, Shape } from '../../types/note'
import {
  CHANGE_COLOR_LABEL,
  COLOR_PICKER_PANEL_LABEL,
  NOTE_COLORS,
  NOTE_MENU_PANEL_LABEL,
  NOTE_MENU_TOGGLE_LABEL,
  SHAPES_MENU_TOGGLE_LABEL,
} from '../../constants'
import { useTogglePopover } from '../../hooks/useTogglePopover'
import { ShapePreview } from '../ShapePreview/ShapePreview'
import { ShapesMenu } from '../ShapesMenu/ShapesMenu'
import styles from './StickyNoteMenu.module.scss'

export interface StickyNoteMenuProps {
  color: NoteColor
  shape: Shape
  onColorChange: (color: NoteColor) => void
  onShapeChange: (shape: Shape) => void
}

export function StickyNoteMenu({
  color,
  shape,
  onColorChange,
  onShapeChange,
}: StickyNoteMenuProps) {
  const colorRowRef = useRef<HTMLDivElement>(null)
  const colorChipRef = useRef<HTMLButtonElement>(null)
  const colorPopover = useTogglePopover(colorRowRef, colorChipRef)

  const shapeRowRef = useRef<HTMLDivElement>(null)
  const shapeChipRef = useRef<HTMLButtonElement>(null)
  const shapePopover = useTogglePopover(shapeRowRef, shapeChipRef)

  const menuContainerRef = useRef<HTMLDivElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const menu = useTogglePopover(menuContainerRef, menuTriggerRef, {
    suppressEscape: colorPopover.isOpen || shapePopover.isOpen,
  })

  function handleColorChipClick(): void {
    if (!colorPopover.isOpen) {
      shapePopover.close()
    }
    colorPopover.toggle()
  }

  function handleShapeChipClick(): void {
    if (!shapePopover.isOpen) {
      colorPopover.close()
    }
    shapePopover.toggle()
  }

  function handleColorSelect(selectedColor: NoteColor): void {
    onColorChange(selectedColor)
    colorPopover.close()
  }

  function handleShapeSelect(selectedShape: Shape): void {
    onShapeChange(selectedShape)
    shapePopover.close()
  }

  return (
    <div className={styles.menuContainer} ref={menuContainerRef}>
      <button
        ref={menuTriggerRef}
        type="button"
        className={styles.menuTrigger}
        aria-label={NOTE_MENU_TOGGLE_LABEL}
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
      {menu.isOpen && (
        <div
          className={styles.panel}
          role="group"
          aria-label={NOTE_MENU_PANEL_LABEL}
        >
          <div className={styles.row} ref={colorRowRef}>
            <button
              ref={colorChipRef}
              type="button"
              className={styles.colorChip}
              style={{ backgroundColor: color }}
              aria-label={CHANGE_COLOR_LABEL}
              aria-expanded={colorPopover.isOpen}
              onClick={handleColorChipClick}
            />
            {colorPopover.isOpen && (
              <div
                className={styles.colorOptions}
                role="group"
                aria-label={COLOR_PICKER_PANEL_LABEL}
              >
                {NOTE_COLORS.map((swatchColor) => (
                  <button
                    key={swatchColor}
                    type="button"
                    className={`${styles.colorOption} ${swatchColor === color ? styles.colorOptionSelected : ''}`}
                    style={{ backgroundColor: swatchColor }}
                    aria-label={`Set note color to ${swatchColor}`}
                    aria-pressed={swatchColor === color}
                    onClick={() => handleColorSelect(swatchColor)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.row} ref={shapeRowRef}>
            <button
              ref={shapeChipRef}
              type="button"
              className={styles.shapeChip}
              aria-label={SHAPES_MENU_TOGGLE_LABEL}
              aria-expanded={shapePopover.isOpen}
              onClick={handleShapeChipClick}
            >
              <ShapePreview shape={shape} />
            </button>
            {shapePopover.isOpen && (
              <ShapesMenu shape={shape} onSelect={handleShapeSelect} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
