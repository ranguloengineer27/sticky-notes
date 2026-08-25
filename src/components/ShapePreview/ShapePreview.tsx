import type { Shape } from '../../types/note'
import styles from './ShapePreview.module.scss'

export interface ShapePreviewProps {
  shape: Shape
}

const SHAPE_PREVIEW_CLASS_BY_SHAPE: Record<Shape, string> = {
  square: styles.shapeSquare,
  circle: styles.shapeCircle,
  triangle: styles.shapeTriangle,
}

export function ShapePreview({ shape }: ShapePreviewProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.shapePreview} ${SHAPE_PREVIEW_CLASS_BY_SHAPE[shape]}`}
    />
  )
}
