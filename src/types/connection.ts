import { CONNECTION_EDGES } from '../constants'

export type ConnectionEdge = (typeof CONNECTION_EDGES)[number]

export interface Connection {
  id: string
  sourceNoteId: string
  targetNoteId: string
}
