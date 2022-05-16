import React from 'react'
import type { InterpreterFrom } from 'xstate'
import { useInterpret } from '@xstate/react'
import { machine } from '../../../../lib/state/story'

const StoryContext = React.createContext<
  InterpreterFrom<typeof machine> | undefined
>(undefined)

function StoryProvider({ children }: React.PropsWithChildren<unknown>) {
  const editor = useInterpret(machine)

  return (
    <StoryContext.Provider value={editor}>{children}</StoryContext.Provider>
  )
}

function useStoryContext() {
  const context = React.useContext(StoryContext)

  if (!context) {
    throw new Error('WriteContext is only available inside WriteProvider.')
  }

  return context
}

export { useStoryContext, StoryProvider }
