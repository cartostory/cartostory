// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    setActiveMapFeature: 'CENTER_ON_FEATURE'
    dropActiveMapFeature: 'RESET_MAP'
    removeFeature: 'REMOVE_FEATURE'
    addFeatureAdditionCallback: 'START_FEATURE_ADDITION'
    addFeature: 'FINISH_FEATURE_ADDITION'
    addFeatureRemovalCallback: 'xstate.init'
    clearPreviousFeatureRemovalCallback: 'REMOVE_FEATURE'
    runFeatureRemovalCallback: 'REMOVE_FEATURE'
    clearFeatureRemovalCallback: 'REMOVE_FEATURE'
    clearPreviousFeatureAdditionCallback: 'FINISH_FEATURE_ADDITION'
    runFeatureAdditionCallback: 'FINISH_FEATURE_ADDITION'
    clearFeatureAdditionCallback: 'FINISH_FEATURE_ADDITION'
  }
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {}
  eventsCausingDelays: {}
  matchesStates:
    | 'map'
    | 'map.unknown'
    | 'map.centeredOnFeature'
    | 'text'
    | 'text.empty'
    | 'text.selected'
    | 'text.selected.withFeatureAlready'
    | 'text.selected.withFeatureAlready.todo'
    | 'text.selected.withFeatureAlready.done'
    | 'text.selected.withNoFeatureYet'
    | 'text.selected.withNoFeatureYet.featureAdditionToStart'
    | 'text.selected.withNoFeatureYet.featureAdditionInProgress'
    | 'text.selected.withNoFeatureYet.featureAdditionDone'
    | {
        map?: 'unknown' | 'centeredOnFeature'
        text?:
          | 'empty'
          | 'selected'
          | {
              selected?:
                | 'withFeatureAlready'
                | 'withNoFeatureYet'
                | {
                    withFeatureAlready?: 'todo' | 'done'
                    withNoFeatureYet?:
                      | 'featureAdditionToStart'
                      | 'featureAdditionInProgress'
                      | 'featureAdditionDone'
                  }
            }
      }
  tags: never
}
