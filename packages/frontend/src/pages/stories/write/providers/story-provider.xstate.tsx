import React from 'react'
import type { InterpreterFrom } from 'xstate'
import { assign } from 'xstate'
import { createMachine } from 'xstate'
import { useInterpret } from '@xstate/react'

const machine = createMachine<{
  features: Array<L.Marker | L.Rectangle>
}>(
  {
    id: 'story',
    context: {
      features: [],
    },
    initial: 'empty',
    states: {
      empty: {
        on: {
          SELECT: {
            target: 'selected',
          },
        },
      },
      selected: {
        always: [
          {
            target: 'withFeatureAlready',
            cond: 'hasFeatureAlready',
          },
          {
            target: 'withNoFeatureYet',
          },
        ],
      },
      withFeatureAlready: {
        initial: 'featureRemovalTodo',
        states: {
          featureRemovalTodo: {},
          featureRemovalInProgress: {},
        },
        on: {
          CANCEL_FEATURE_REMOVAL: '#story.empty',
          START_FEATURE_REMOVAL: '.featureRemovalInProgress',
          UNSELECT: '#story.empty',
        },
      },
      withNoFeatureYet: {
        initial: 'featureAdditionToStart',
        states: {
          featureAdditionInProgress: {
            on: {
              FINISH_FEATURE_ADDITION: {
                target: 'featureAdditionDone',
                actions: assign({
                  features: (context, event) => [
                    ...context.features,
                    event.data.feature,
                  ],
                }),
              },
            },
          },
          featureAdditionToStart: {},
          featureAdditionDone: {},
        },
        on: {
          CANCEL_FEATURE_ADDITION: '#story.empty',
          START_FEATURE_ADDITION: '.featureAdditionInProgress',
          UNSELECT: '#story.empty',
        },
      },
    },
  },
  {
    guards: {
      hasFeatureAlready(_, event) {
        return !!event.featureId
      },
    },
  },
)

const StoryContext =
  // @ts-expect-error error
  React.createContext<InterpreterFrom<typeof machine>>(undefined)

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

function isSelectionEmpty(state) {
  console.log('isSelectionEmpty', state.matches('empty'), state.value)
  return state.matches('empty')
}

function selectionHasMarker(state) {
  console.log('isMarkerActivated', state.value)
  return state.matches('selected.marker')
}

export {
  machine,
  useStoryContext,
  StoryProvider,
  selectionHasMarker,
  isSelectionEmpty,
}
