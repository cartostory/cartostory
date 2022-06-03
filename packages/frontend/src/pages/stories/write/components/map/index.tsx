import L from 'leaflet'
import { MapContainer, Marker, useMap, useMapEvent } from 'react-leaflet'
import { bboxOptions } from '../../../../../config'
import { MapLayers } from '../map-layers'
import { UploadButton } from '../upload-button'
import React from 'react'
import { randomString } from '../../../../../utils'
import { useActor, useSelector } from '@xstate/react'
import {
  isAddingFeature,
  isCenteredOnFeature,
} from '../../../../../lib/state/story'
import { useAction, useStoryContext } from '../../providers/story-provider'
import type { EntityMarker } from '../../../../../lib/editor'
import { entityMarker, isEntityMarker } from '../../../../../lib/editor'
import '../../../../../lib/leaflet'

function Map() {
  const storyMachine = useStoryContext()
  const isCentered = useSelector(storyMachine, isCenteredOnFeature)
  const isFeatureBeingAdded = useSelector(storyMachine, isAddingFeature)
  const [state] = useActor(storyMachine)
  const { centerStory, reset } = useAction()
  const features = state.context.features.filter(isEntityMarker)
  const feature =
    isCentered && state.context.feature?.target === 'map'
      ? state.context.feature?.feature
      : undefined
  const centerOnFeature = (f: typeof features[number]) => {
    centerStory(f.feature.properties.id)
  }

  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      {isCentered ? <OnMapMove onDone={reset} /> : null}
      {feature ? <FlyToFeature feature={feature} /> : null}
      <MapLayers />
      {isFeatureBeingAdded ? <EditLayer /> : null}
      {features.map(feature => (
        <Feature
          key={feature.feature.properties.id}
          feature={feature}
          onClick={centerOnFeature}
        />
      ))}

      <UploadButton />
    </MapContainer>
  )
}

function Feature({
  feature,
  onClick,
}: {
  feature: EntityMarker
  onClick: (f: typeof feature) => void
}) {
  return (
    <Marker
      eventHandlers={{
        click: () => onClick(feature),
      }}
      key={feature.feature.properties.id}
      position={feature.getLatLng()}
    />
  )
}

function OnMapMove({ onDone }: { onDone: () => void }) {
  useMapEvent('moveend', onDone)

  return null
}

function EditLayer() {
  useDraw('marker')

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
  const { finishFeatureAddition } = useAction()
  const map = useMap() as L.DrawMap
  const { feature, handler, options } = useCreateFeature(featureType) ?? {}
  const drawing = React.useRef<L.Draw.Marker | L.Draw.Rectangle>()

  React.useEffect(() => {
    if (!(map && feature && handler)) {
      return
    }

    if (!featureType) {
      map.off(window.L.Draw.Event.CREATED)
      return
    }

    if (!drawing.current) {
      drawing.current = new feature(map, options)
    }

    drawing.current.enable()

    map.on(window.L.Draw.Event.CREATED, e => {
      const feature = handler(e)

      if (isEntityMarker(feature)) {
        finishFeatureAddition(feature)
      }

      drawing.current?.disable()
    })
  }, [finishFeatureAddition, map, featureType, feature, handler, options])
}

function FlyToFeature({ feature }: { feature: L.Marker | L.Rectangle }) {
  const map = useMap()

  // eslint-disable-next-line use-encapsulation/prefer-custom-hooks
  React.useEffect(() => {
    if (!(feature && isEntityMarker(feature))) {
      return
    }

    map.flyTo(feature.getLatLng())
  }, [feature, map])

  return null
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
