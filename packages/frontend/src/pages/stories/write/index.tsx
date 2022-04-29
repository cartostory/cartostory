import React from 'react'
import L from 'leaflet'
import { MapContainer, useMap } from 'react-leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import { UploadButton } from './components'
import { MapLayers } from './components/map-layers'
import { ReactComponent as Link } from '../../../assets/link.svg'
import { deburr as _deburr, kebabCase as _kebabCase } from 'lodash-es'
import { randomString } from '../../../utils'
import { Editor } from './components/editor'
import { bboxOptions } from '../../../config'

type FeatureType = 'marker' | 'rectangle'

L.Marker.prototype.setIcon(
  L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerRetinaIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  }),
)

const urlSuffix = randomString(6)

const WriteContext = React.createContext<
  ReturnType<typeof useMapEditor> | undefined
>(undefined)

function WriteProvider({ children }: React.PropsWithChildren<unknown>) {
  const editor = useMapEditor()

  return (
    <WriteContext.Provider value={editor}>{children}</WriteContext.Provider>
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

function Write() {
  const [title, setTitle] = useTitle()
  const urlSlug = _deburr(_kebabCase(title))
  const url = `${urlSlug}-${urlSuffix}`

  return (
    <WriteProvider>
      <div className="w-full flex">
        <div className="w-1/2 bg-gray-200">
          <Map />
          <div
            aria-hidden
            className="absolute top-0 z-[10000] w-[10px] h-[100vh] right-1/2 pointer-events-none"
            style={{ boxShadow: 'inset -5px 0px 3px 0px rgba(0, 0, 0, .15)' }}
          />
        </div>
        <div className="w-1/2 p-5 px-10 flex flex-col h-[100vh]">
          <form>
            <input
              value={title}
              onChange={setTitle}
              style={{ fontFamily: 'Phenomena' }}
              className="w-full py-2 text-4xl bg-transparent border-0 border-b-2 text-gray-500 font-bold focus:outline-none"
              type="text"
              placeholder="Your story title"
            />
          </form>
          <p className="flex space-x-2 text-gray-500 my-3">
            {title.length > 0 ? (
              <>
                <Link />
                <small>your story URL: {url}</small>
              </>
            ) : null}
          </p>
          <Editor />
        </div>
      </div>
    </WriteProvider>
  )
}

function Map() {
  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      <EditLayer />
      <UploadButton />
      <MapLayers />
    </MapContainer>
  )
}

function EditLayer() {
  const { nextFeature } = useWriteContext()
  useDraw(nextFeature)

  return null
}

function useDraw(featureType?: 'marker' | 'rectangle') {
  const map = useMap() as L.DrawMap
  const { callback } = useWriteContext()

  React.useEffect(() => {
    console.log('useDraw callback', callback)
  }, [callback])

  const createRectangle = React.useCallback((e: L.LeafletEvent) => {
    const bounds = e.layer.getBounds() as L.LatLngBounds

    return L.rectangle(bounds, {
      ...bboxOptions.plain.style,
    })
  }, [])

  const createMarker = React.useCallback((e: L.LeafletEvent) => {
    return e.layer
  }, [])

  React.useEffect(() => {
    if (!map) {
      return
    }

    if (!featureType) {
      map.off(window.L.Draw.Event.CREATED)
      return
    }

    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    type Config = {
      [key in typeof featureType]: {
        handler: (
          e: L.LeafletEvent,
        ) => key extends 'marker' ? L.Marker : L.Rectangle
        feature: typeof L.Draw[Capitalize<key>]
        options?: key extends 'marker'
          ? L.DrawOptions.MarkerOptions
          : L.DrawOptions.RectangleOptions
      }
    }

    const config: Config = {
      marker: {
        feature: L.Draw.Marker,
        handler: createMarker,
      },
      rectangle: {
        feature: L.Draw.Rectangle,
        handler: createRectangle,
        options: {
          showArea: false,
          shapeOptions: bboxOptions.plain.style,
        },
      },
    }

    const { feature, handler, options = {} } = config[featureType]

    new feature(map, options).enable()

    map.off(window.L.Draw.Event.CREATED)
    map.on(window.L.Draw.Event.CREATED, e => {
      const newFeature = handler(e)
      map.addLayer(newFeature)
      callback?.(newFeature)
    })
  }, [callback, map, featureType, createRectangle, createMarker])
}

function useTitle(): [string, React.FormEventHandler<HTMLInputElement>] {
  const [title, setTitle] = React.useState('')

  const handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    setTitle(e.currentTarget.value)
  }

  return [title, handleChange]
}

function useWriteContext() {
  const context = React.useContext(WriteContext)

  if (!context) {
    throw new Error('WriteContext is only available inside WriteProvider.')
  }

  return context
}

export { Write, useWriteContext }
