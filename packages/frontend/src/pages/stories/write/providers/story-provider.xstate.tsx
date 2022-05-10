import React from 'react'
import type { InterpreterFrom } from 'xstate'
import { assign } from 'xstate'
import { createMachine } from 'xstate'
import { useInterpret } from '@xstate/react'
import { last } from 'lodash-es'

type Context = {
  features: Array<L.Marker | L.Rectangle>
  previousOnFeatureAdd?: (feature: L.Marker | L.Rectangle) => void
  onFeatureAdd?: (feature: L.Marker | L.Rectangle) => void
}

const machine = createMachine<Context>(
  {
    id: 'story',
    schema: {
      context: {} as Context,
    },
    context: {
      // see https://egghead.io/lessons/xstate-how-action-order-affects-assigns-to-context-in-a-xstate-machine
      previousOnFeatureAdd: undefined,
      onFeatureAdd: undefined,
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
          featureAdditionToStart: {
            on: {
              START_FEATURE_ADDITION: {
                target: 'featureAdditionInProgress',
                actions: assign({
                  onFeatureAdd: (_context, event) => event.data.callback,
                }),
              },
            },
          },
          featureAdditionDone: {
            always: '#story.empty',
            // see https://egghead.io/lessons/xstate-how-action-order-affects-assigns-to-context-in-a-xstate-machine
            entry: [
              'clearPreviousFeatureAdditionCallback',
              'runFeatureAdditionCallback',
              'clearFeatureAdditionCallback',
            ],
          },
        },
        on: {
          CANCEL_FEATURE_ADDITION: {
            target: '#story.empty',
          },
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
    actions: {
      runFeatureAdditionCallback: context => {
        const feature = last(context.features)
        if (!feature) {
          throw new Error('Feature is missing')
        }
        context.previousOnFeatureAdd?.(feature)
      },
      clearFeatureAdditionCallback: assign<Context>({
        onFeatureAdd: undefined,
      }),
      clearPreviousFeatureAdditionCallback: assign<Context>({
        previousOnFeatureAdd: (context: Context) => context.onFeatureAdd,
      }),
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
