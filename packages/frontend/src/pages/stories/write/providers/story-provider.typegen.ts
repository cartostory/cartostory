// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    dropActiveFeature: 'RESET'
    removeFeature: 'REMOVE_FEATURE'
    addFeatureAdditionCallback: 'START_FEATURE_ADDITION'
    addFeature: 'FINISH_FEATURE_ADDITION'
    setActiveFeature: 'CENTER_ON_FEATURE'
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
    | 'feature'
    | 'feature.unknown'
    | 'feature.centered'
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
        feature?: 'unknown' | 'centered'
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
