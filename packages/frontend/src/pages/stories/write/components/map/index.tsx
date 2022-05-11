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
} from '../../providers/story-provider'
import { entityMarker, isEntityMarker } from '../../../../../lib/entity-marker'

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
  const storyMachine = useXStateStoryContext()
  const [state] = useActor(storyMachine)
  const feature = isCenteredOnFeature(state)
    ? state.context.mapFeature
    : undefined
  const map = useMap()

  // eslint-disable-next-line use-encapsulation/prefer-custom-hooks
  React.useEffect(() => {
    if (!(feature && map && isEntityMarker(feature))) {
      return
    }

    map.flyTo(feature.getLatLng())
  }, [feature, map])

  return null
}

function Map() {
  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      <EditLayer />
      <MapLayers />
      <FlyToFeature />
      <UploadButton />
      <Features />
    </MapContainer>
  )
}

function Features() {
  const storyMachine = useXStateStoryContext()
  const [state] = useActor(storyMachine)

  return (
    <>
      {state.context.features.filter(isEntityMarker).map(feature => (
        <Marker key={feature.options.id} position={feature.getLatLng()} />
      ))}
    </>
  )
}

function EditLayer() {
  const storyMachine = useXStateStoryContext()
  const [state] = useActor(storyMachine)
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
  const storyMachine = useXStateStoryContext()
  const [, send] = useActor(storyMachine)
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
      send({ type: 'FINISH_FEATURE_ADDITION', feature })
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
  return entityMarker(e.layer.getLatLng())
}

export { Map }
