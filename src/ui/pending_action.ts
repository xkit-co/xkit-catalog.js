import { ConnectionOnly } from '@xkit-co/xkit.js'

export enum ActionType {
  None = 0,
  Install = 1,
  Reconnect = 2,
  Remove = 3,
  Settings = 4
}

export interface PendingAction {
  type: ActionType
  connectionId?: string
}

export function isPending(
  pendingAction: PendingAction,
  type: ActionType,
  connection?: ConnectionOnly
): boolean {
  return (
    pendingAction.type === type && pendingAction.connectionId === connection?.id
  )
}
