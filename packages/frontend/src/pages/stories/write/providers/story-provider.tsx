import React from 'react'
import type { InterpreterFrom } from 'xstate'
import { assign } from 'xstate'
import { createMachine } from 'xstate'
import { useInterpret } from '@xstate/react'
import { last } from 'lodash-es'
import type { entityMarker } from '../../../../lib/entity-marker'
import { isEntityMarker } from '../../../../lib/entity-marker'

type Context = {
  features: Array<ReturnType<typeof entityMarker> | L.Rectangle>
  previousOnFeatureAdd?: (feature: L.Marker | L.Rectangle) => void
  onFeatureAdd?: (feature: L.Marker | L.Rectangle) => void
  previousOnFeatureRemove?: () => void
  onFeatureRemove?: (feature: L.Marker | L.Rectangle) => void
  mapFeature?: L.Marker | L.Rectangle
}

type Events =
  | { type: 'CANCEL_FEATURE_ADDITION' }
  | { type: 'CANCEL_FEATURE_REMOVAL' }
  | { type: 'CENTER_ON_FEATURE'; id: string }
  | {
      type: 'FINISH_FEATURE_ADDITION'
      feature: typeof entityMarker | L.Rectangle
    }
  | { type: 'REMOVE_FEATURE'; id: string }
  | { type: 'SELECT_WITH_FEATURE_ALREADY' }
  | { type: 'SELECT_WITH_NO_FEATURE_YET' }
  | {
      type: 'START_FEATURE_ADDITION'
      callback: Exclude<Context['onFeatureAdd'], undefined>
    }
  | { type: 'UNSELECT' }

const machine = createMachine<Context>(
  {
    id: 'story',
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./story-provider.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    context: {
      // see https://egghead.io/lessons/xstate-how-action-order-affects-assigns-to-context-in-a-xstate-machine on why prev/cur pair are needed
      previousOnFeatureAdd: undefined,
      onFeatureAdd: undefined,
      previousOnFeatureRemove: undefined,
      onFeatureRemove: undefined,
      features: [],
      mapFeature: undefined,
    },
    type: 'parallel',
    states: {
      map: {
        on: {
          CENTER_ON_FEATURE: {
            target: '.centeredOnFeature',
            actions: 'setActiveMapFeature',
          },
        },
        initial: 'unknown',
        states: {
          unknown: {},
          centeredOnFeature: {},
        },
      },
      text: {
        initial: 'empty',
        states: {
          empty: {
            on: {
              SELECT_WITH_FEATURE_ALREADY: {
                target: 'selected.withFeatureAlready',
              },
              SELECT_WITH_NO_FEATURE_YET: {
                target: 'selected.withNoFeatureYet',
              },
            },
          },
          selected: {
            states: {
              withFeatureAlready: {
                initial: 'todo',
                states: {
                  todo: {
                    entry: 'addFeatureRemovalCallback',
                    on: {
                      REMOVE_FEATURE: {
                        target: 'done',
                        actions: 'removeFeature',
                      },
                    },
                  },
                  done: {
                    always: '#story.text.empty',
                    entry: [
                      'clearPreviousFeatureRemovalCallback',
                      'runFeatureRemovalCallback',
                      'clearFeatureRemovalCallback',
                    ],
                  },
                },
                on: {
                  CANCEL_FEATURE_REMOVAL: '#story.text.empty',
                  UNSELECT: '#story.text.empty',
                },
              },
              withNoFeatureYet: {
                initial: 'featureAdditionToStart',
                states: {
                  featureAdditionToStart: {
                    on: {
                      START_FEATURE_ADDITION: {
                        target: 'featureAdditionInProgress',
                        actions: 'addFeatureAdditionCallback',
                      },
                    },
                  },
                  featureAdditionInProgress: {
                    on: {
                      FINISH_FEATURE_ADDITION: {
                        target: 'featureAdditionDone',
                        actions: 'addFeature',
                      },
                    },
                  },
                  featureAdditionDone: {
                    always: '#story.text.empty',
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
                    target: '#story.text.empty',
                  },
                  UNSELECT: '#story.text.empty',
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      runFeatureRemovalCallback: context => {
        context.previousOnFeatureRemove?.()
      },
      clearFeatureRemovalCallback: assign({
        onFeatureRemove: undefined,
      }),
      clearPreviousFeatureRemovalCallback: assign({
        previousOnFeatureRemove: context => context.onFeatureRemove,
      }),
      addFeatureRemovalCallback: assign({
        onFeatureRemove: (_context, event) => event.callback,
      }),

      runFeatureAdditionCallback: context => {
        const feature = last(context.features)
        if (!feature) {
          throw new Error('Feature is missing')
        }
        context.previousOnFeatureAdd?.(feature)
      },
      clearFeatureAdditionCallback: assign({
        onFeatureAdd: undefined,
      }),
      clearPreviousFeatureAdditionCallback: assign({
        previousOnFeatureAdd: context => context.onFeatureAdd,
      }),
      addFeatureAdditionCallback: assign({
        onFeatureAdd: (_context, event) => event.callback,
      }),

      addFeature: assign({
        features: (context, event) => [...context.features, event.feature],
      }),
      removeFeature: assign({
        features: (context, event) =>
          context.features
            .filter(isEntityMarker)
            .filter(feature => feature.options.id !== event.id),
      }),
      setActiveMapFeature: assign({
        mapFeature: (context, event) =>
          context.features
            .filter(isEntityMarker)
            .find(feature => feature.options.id === event.id),
      }),
    },
  },
)

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

function isSelectionEmpty(state) {
  return state.matches('story.empty')
}

function selectionHasFeature(state) {
  return state.matches('text.selected.withFeatureAlready')
}

function isAddingFeature(state) {
  return state.matches(
    'text.selected.withNoFeatureYet.featureAdditionInProgress',
  )
}

function isCenteredOnFeature(state) {
  return state.matches('map.centeredOnFeature')
}

export {
  machine,
  useStoryContext,
  StoryProvider,
  selectionHasFeature,
  isSelectionEmpty,
  isAddingFeature,
  isCenteredOnFeature,
}
