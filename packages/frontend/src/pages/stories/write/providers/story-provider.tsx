import React from 'react'
import type L from 'leaflet'

type FeatureType = 'marker' | 'rectangle'

const StoryContext = React.createContext<
  ReturnType<typeof useMapEditor> | undefined
>(undefined)

function StoryProvider({ children }: React.PropsWithChildren<unknown>) {
  const editor = useMapEditor()

  return (
    <StoryContext.Provider value={editor}>{children}</StoryContext.Provider>
  )
}

function useMapEditor() {
  const [nextFeature, setNextFeature] = React.useState<FeatureType>()
  const [features, setFeatures] = React.useState<
    Array<typeof L[Capitalize<FeatureType>]> | undefined
  >()
  const [callback, setCallback] = React.useState<() => {}>()
  const [map, setMap] = React.useState<L.Map | undefined>()

  const addMarker = () => setNextFeature('marker')
  const addRectangle = () => setNextFeature('rectangle')
  const cancel = () => {
    setNextFeature(undefined)
    setCallback(undefined)
  }
  const addFeature = (feature: typeof L[Capitalize<FeatureType>]) => {
    callback?.(feature)
    setFeatures(cur => [...(cur ?? []), feature])
    cancel()
  }
  const removeFeature = (id: string) => {
    setFeatures(cur => cur?.filter(feature => feature.options.id !== id))
  }

  return {
    nextFeature,
    addMarker,
    addRectangle,
    addFeature,
    removeFeature,
    features,
    cancel,
    callback,
    setCallback,
    map,
    setMap,
  }
}

function useStoryContext() {
  const context = React.useContext(StoryContext)

  if (!context) {
    throw new Error('WriteContext is only available inside WriteProvider.')
  }

  return context
}

export { useStoryContext, StoryProvider }
