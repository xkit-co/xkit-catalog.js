import { Connection } from '@xkit-co/xkit.js'

export default function connectionName (connection: Connection): string {
  return connection.authorization?.display_label ||
    `${connection.connector.slug}-${connection.id.slice(0, 4)}`
}
