import L from 'leaflet'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import { bboxOptions } from '../../../../../config'
import { MapLayers } from '../map-layers'
import { UploadButton } from '../upload-button'
import React from 'react'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { randomString } from '../../../../../utils'
import { useActor } from '@xstate/react'
import {
  isAddingFeature,
  isCenteredOnFeature,
  useStoryContext as useXStateStoryContext,
} from '../../providers/story-provider.xstate'

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

function FlyToFeature() {
  const x = useXStateStoryContext()
  const [state] = useActor(x)
  const feature = isCenteredOnFeature(state)
    ? state.context.mapFeature
    : undefined
  const map = useMap()

  // eslint-disable-next-line use-encapsulation/prefer-custom-hooks
  React.useEffect(() => {
    if (!(feature && map)) {
      return
    }

    // @ts-expect-error depends on whether feature is a marker or a rectangle
    map.flyTo(feature.getLatLng())
  }, [feature, map])

  return null
}

function Map() {
  const x = useXStateStoryContext()
  const [state] = useActor(x)

  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      <EditLayer />
      <MapLayers />
      <FlyToFeature />
      <UploadButton />
      {state.context.features.map(feature => (
        // @ts-expect-error error
        <Marker key={feature.options.id} position={feature.getLatLng()} />
      ))}
    </MapContainer>
  )
}

function EditLayer() {
  const x = useXStateStoryContext()
  const [state] = useActor(x)
  useDraw(isAddingFeature(state) ? 'marker' : undefined)

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
        // @ts-expect-error if removed, Leaflet.Draw throws error
        showArea: false,
        shapeOptions: bboxOptions.plain.style,
      },
    },
  }

  const { feature, handler, options = {} } = config[featureType]

  return { feature, handler, options }
}

function useDraw(featureType?: 'marker' | 'rectangle') {
  const x = useXStateStoryContext()
  const [, send] = useActor(x)
  const map = useMap() as L.DrawMap
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
      const feature = handler(e)
      send({ type: 'FINISH_FEATURE_ADDITION', data: { feature } })
      drawing.current?.disable()
    })
  }, [send, map, featureType, feature, handler, options])
}

function createRectangle(e: L.LeafletEvent) {
  const bounds = e.layer.getBounds() as L.LatLngBounds

  return L.rectangle(bounds, {
    ...bboxOptions.plain.style,
    // @ts-expect-error TODO extend L.rectangle to accept id
    id: randomString(6),
  })
}

function createMarker(e: L.LeafletEvent) {
  return L.marker(e.layer.getLatLng(), {
    // @ts-expect-error TODO extend L.marker to accept id
    id: randomString(6),
  })
}

export { Map }
