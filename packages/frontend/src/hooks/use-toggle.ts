import React from 'react'

const useToggle = (
  initialValue = true,
): [boolean, Record<'toggle' | 'reset' | 'setOn' | 'setOff', () => void>] => {
  const [on, setIsOn] = React.useState(initialValue)

  return [
    on,
    {
      toggle: () => setIsOn(v => !v),
      reset: () => setIsOn(initialValue),
      setOn: () => setIsOn(true),
      setOff: () => setIsOn(false),
    },
  ]
}

export { useToggle }
