import React from 'react'

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

  React.useEffect(() => {
    console.log('useMapEditor callback', callback)
  }, [callback])

  const addMarker = () => setNextFeature('marker')
  const addRectangle = () => setNextFeature('rectangle')
  const cancel = () => {
    setNextFeature(undefined)
    setCallback(undefined)
  }

  return {
    nextFeature,
    addMarker,
    addRectangle,
    cancel,
    callback,
    setCallback,
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
