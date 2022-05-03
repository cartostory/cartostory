import L from 'leaflet'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import { bboxOptions } from '../../../../../config'
import { MapLayers } from '../map-layers'
import { useStoryContext } from '../../providers/story-provider'
import { UploadButton } from '../upload-button'
import React from 'react'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { randomString } from '../../../../../utils'

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

function Map() {
  const { features } = useStoryContext()
  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      <ProvideMapToStory />
      <EditLayer />
      <MapLayers />
      <UploadButton />
      {features?.map(feature => (
        <Marker position={feature.getLatLng()} />
      ))}
    </MapContainer>
  )
}

function ProvideMapToStory() {
  const map = useMap()
  const { setMap } = useStoryContext()

  React.useEffect(() => {
    setMap(map)
  }, [map, setMap])

  return null
}

function EditLayer() {
  const { nextFeature } = useStoryContext()
  useDraw(nextFeature)

  return null
}

function useCreateFeature(featureType?: 'marker' | 'rectangle') {
  if (!featureType) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  type Config = {
    [key in Exclude<typeof featureType, undefined>]: {
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
        showArea: false, // if removed, Leaflet.Draw throws error
        shapeOptions: bboxOptions.plain.style,
      },
    },
  }

  const { feature, handler, options = {} } = config[featureType]

  return { feature, handler, options }
}

function useDraw(featureType?: 'marker' | 'rectangle') {
  const map = useMap() as L.DrawMap
  const { callback, addFeature } = useStoryContext()
  const { feature, handler, options } = useCreateFeature(featureType) ?? {}
  const drawing = React.useRef<L.Draw.Marker | L.Draw.Rectangle>()

  React.useEffect(() => {
    if (!map) {
      return
    }

    if (!featureType) {
      map.off(window.L.Draw.Event.CREATED)
      return
    }

    if (!feature || !handler) {
      return
    }

    if (!drawing.current) {
      drawing.current = new feature(map, options)
    }

    drawing.current.enable()

    map.on(window.L.Draw.Event.CREATED, e => {
      const newFeature = handler(e)
      addFeature(newFeature)
      drawing.current?.disable()
    })
  }, [addFeature, callback, map, featureType, feature, handler, options])
}

function createRectangle(e: L.LeafletEvent) {
  const bounds = e.layer.getBounds() as L.LatLngBounds

  return L.rectangle(bounds, {
    ...bboxOptions.plain.style,
    id: randomString(6), // TODO extend L.rectangle to accept id
  })
}

function createMarker(e: L.LeafletEvent) {
  return L.marker(e.layer.getLatLng(), {
    id: randomString(6), // TODO extend L.marker to accept id
  })
}

export { Map }
