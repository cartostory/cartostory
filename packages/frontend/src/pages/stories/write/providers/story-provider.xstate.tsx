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
                    feature => feature.options.id === event.data.featureId,
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
              SELECT: {
                target: 'selected',
              },
            },
          },
          selected: {
            initial: 'deciding',
            states: {
              // see https://spectrum.chat/statecharts/introductions/xstate-eventless-transitions-to-the-child-state~4b8ca744-be6d-405c-a431-73c57c42f209 needed to avoid too much recursion error
              deciding: {
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
                  CANCEL_FEATURE_REMOVAL: '#story.text.empty',
                  START_FEATURE_REMOVAL: '.featureRemovalInProgress',
                  UNSELECT: '#story.text.empty',
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
                          onFeatureAdd: (_context, event) =>
                            event.data.callback,
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

function selectionHasMarker(state) {
  return state.matches('text.selected.marker')
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
  selectionHasMarker,
  isSelectionEmpty,
  isAddingFeature,
  isCenteredOnFeature,
}
