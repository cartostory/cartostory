import L from 'leaflet'
import { MapContainer, useMap } from 'react-leaflet'
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
  return (
    <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
      <EditLayer />
      <UploadButton />
      <MapLayers />
    </MapContainer>
  )
}

function EditLayer() {
  const { nextFeature } = useStoryContext()
  useDraw(nextFeature)

  return null
}

function useDraw(featureType?: 'marker' | 'rectangle') {
  const map = useMap() as L.DrawMap
  const { callback } = useStoryContext()

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
          showArea: false, // if removed, Leaflet.Draw throws error
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

export { Map }
