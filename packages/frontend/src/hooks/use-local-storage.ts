import React from 'react'

type Result<T> = [
  T,
  React.Dispatch<React.SetStateAction<Exclude<T, undefined>>>,
  () => void,
]

function useLocalStorage<T>(key: string, initialValue: T): Result<T>
function useLocalStorage<T>(
  key: string,
  initialValue?: T,
): Result<T | undefined>
function useLocalStorage<T>(key: string, initialValue: T | undefined) {
  const [value, setValue] = React.useState<T | undefined>(() => {
    const item = window.localStorage.getItem(key)

    if (!item) {
      return initialValue
    }

    return JSON.parse(item)
  })

  const clear = () => {
    setValue(undefined)
  }

  React.useEffect(() => {
    if (!value) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue, clear]
}

export { useLocalStorage }
