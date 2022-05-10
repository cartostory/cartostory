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
            actions: [
              assign<Context>({
                mapFeature: (context, event) =>
                  context.features.filter(isEntityMarker).find(
                    // @ts-expect-error error
                    feature => feature.options.id === event.featureId,
                  ),
              }),
            ],
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
                    entry: [
                      assign({
                        onFeatureRemove: (_context, event) => event.callback,
                      }),
                    ],
                    on: {
                      REMOVE_FEATURE: {
                        target: 'done',
                        actions: [
                          assign({
                            features: (context, event) =>
                              context.features
                                .filter(isEntityMarker)
                                .filter(
                                  feature => feature.options.id !== event.id,
                                ),
                          }),
                        ],
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
                        actions: assign({
                          onFeatureAdd: (_context, event) => event.callback,
                        }),
                      },
                    },
                  },
                  featureAdditionInProgress: {
                    on: {
                      FINISH_FEATURE_ADDITION: {
                        target: 'featureAdditionDone',
                        actions: assign({
                          features: (context, event) => [
                            ...context.features,
                            event.feature,
                          ],
                        }),
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
      clearFeatureRemovalCallback: assign<Context>({
        onFeatureRemove: undefined,
      }),
      clearPreviousFeatureRemovalCallback: assign<Context>({
        previousOnFeatureRemove: (context: Context) => context.onFeatureRemove,
      }),

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
