import type { Shape } from '../../types/note'
import { SHAPES, SHAPES_MENU_PANEL_LABEL } from '../../constants'
import { ShapePreview } from '../ShapePreview/ShapePreview'
import styles from './ShapesMenu.module.scss'

export interface ShapesMenuProps {
  shape: Shape
  onSelect: (shape: Shape) => void
}

export function ShapesMenu({ shape, onSelect }: ShapesMenuProps) {
  return (
    <div
      className={styles.panel}
      role="group"
      aria-label={SHAPES_MENU_PANEL_LABEL}
    >
      {SHAPES.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.shapeOption} ${option === shape ? styles.shapeOptionSelected : ''}`}
          aria-label={`Set note shape to ${option}`}
          aria-pressed={option === shape}
          onClick={() => onSelect(option)}
        >
          <ShapePreview shape={option} />
        </button>
      ))}
    </div>
  )
}
