import { useState } from 'react'

export default function useAsyncActionHandler(
  action: () => void | Promise<void>
): [boolean, () => void | Promise<void>] {
  const [isLoading, setIsLoading] = useState(false)
  const handler = async function (): Promise<void> {
    try {
      setIsLoading(true)
      await action()
    } finally {
      setIsLoading(false)
    }
  }

  return [isLoading, handler]
}
