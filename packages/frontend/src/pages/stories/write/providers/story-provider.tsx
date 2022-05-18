import React from 'react'
import type { InterpreterFrom } from 'xstate'
import { useActor, useInterpret } from '@xstate/react'
import { machine } from '../../../../lib/state/story'
import type { EntityMarker } from '../../../../lib/editor'

const StoryContext = React.createContext<
  InterpreterFrom<typeof machine> | undefined
>(undefined)

const ActionContext = React.createContext<
  | {
      centerMap: (id: string) => void
      centerStory: (id: string) => void
      clearSelection: () => void
      finishFeatureAddition: (feature: EntityMarker) => void
      removeFeature: (id: string) => void
      reset: () => void
      selectWithFeature: (id: string, callback: () => void) => void
      selectWithNoFeature: () => void
      startFeatureAddition: (
        callback: (feature: EntityMarker) => boolean,
      ) => void
    }
  | undefined
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

function ActionProvider({ children }: React.PropsWithChildren<unknown>) {
  const machine = useStoryContext()
  const [, send] = useActor(machine)

  const removeFeature = (id: string) => {
    send({
      type: 'REMOVE_FEATURE',
      id,
    })
  }

  const startFeatureAddition = (callback: (feature: EntityMarker) => void) => {
    send({
      type: 'START_FEATURE_ADDITION',
      callback,
    })
  }

  const reset = () => {
    send('RESET')
  }

  const _centerOnFeature = (target: 'map' | 'story') => (id: string) => {
    send({
      type: 'CENTER_ON_FEATURE',
      id,
      target,
    })
  }

  const centerMap = _centerOnFeature('map')

  const centerStory = _centerOnFeature('story')

  const clearSelection = () => {
    send('UNSELECT')
  }

  const selectWithFeature = (id: string, callback: () => void) => {
    send({
      type: 'SELECT_WITH_FEATURE_ALREADY',
      featureId: id,
      callback,
    })
  }

  const selectWithNoFeature = () => {
    send('SELECT_WITH_NO_FEATURE_YET')
  }

  const finishFeatureAddition = (feature: EntityMarker) => {
    send({ type: 'FINISH_FEATURE_ADDITION', feature })
  }

  const value = {
    centerMap,
    centerStory,
    clearSelection,
    removeFeature,
    reset,
    selectWithFeature,
    selectWithNoFeature,
    startFeatureAddition,
    finishFeatureAddition,
  }

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  )
}

function useAction() {
  const context = React.useContext(ActionContext)

  if (!context) {
    throw new Error('ActionContext is only available inside ActionProvider.')
  }

  return context
}

export { useAction, useStoryContext, StoryProvider, ActionProvider }
