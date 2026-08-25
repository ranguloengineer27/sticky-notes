import type { Note } from '../../types/note'
import type { Connection } from '../../types/connection'
import { findNoteById } from '../../utils/findNoteById'
import { computeConnectionPath } from '../../utils/computeConnectionPath'
import styles from './ConnectionsLayer.module.scss'

export interface ConnectionsLayerProps {
  notes: Note[]
  connections: Connection[]
}

export function ConnectionsLayer({
  notes,
  connections,
}: ConnectionsLayerProps) {
  return (
    <svg className={styles.layer} aria-hidden="true">
      <defs>
        <marker
          id="connection-arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" className={styles.arrowhead} />
        </marker>
      </defs>
      {connections.map((connection) => {
        const sourceNote = findNoteById(notes, connection.sourceNoteId)
        const targetNote = findNoteById(notes, connection.targetNoteId)
        if (!sourceNote || !targetNote) return null

        const path = computeConnectionPath(sourceNote, targetNote)

        return (
          <line
            key={connection.id}
            data-testid={`connection-arrow-${connection.id}`}
            x1={path.x1}
            y1={path.y1}
            x2={path.x2}
            y2={path.y2}
            className={styles.connectionLine}
            markerEnd="url(#connection-arrowhead)"
          />
        )
      })}
    </svg>
  )
}
