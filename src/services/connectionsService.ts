import type { Connection } from '../types/connection'
import { CONNECTIONS_STORAGE_KEY } from '../constants'
import { getErrorMessage } from '../utils/getErrorMessage'

export function loadConnections(): Connection[] {
  try {
    const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY)
    return raw === null ? [] : (JSON.parse(raw) as Connection[])
  } catch (error) {
    throw new Error(
      `Failed to load connections from localStorage: ${getErrorMessage(error)}`,
    )
  }
}

export function saveConnections(connections: Connection[]): void {
  try {
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(connections))
  } catch (error) {
    throw new Error(
      `Failed to save ${connections.length} connection(s) to localStorage: ${getErrorMessage(error)}`,
    )
  }
}
