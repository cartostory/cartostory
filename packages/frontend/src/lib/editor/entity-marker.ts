import L from 'leaflet'
import { randomString } from '../../utils'

class EntityMarker extends L.Marker {
  constructor(latLng: L.LatLngExpression, options?: L.MarkerOptions) {
    super(latLng, options)
    this.feature = {
      ...this.feature,
      type: 'Feature',
      properties: {
        id: randomString(6),
      },
    }
  }
}

function entityMarker(latLng: L.LatLngExpression, options?: L.MarkerOptions) {
  return new EntityMarker(latLng, options)
}

function isEntityMarker(obj: L.Marker | L.Rectangle): obj is EntityMarker {
  return 'id' in obj.feature!.properties
}

export { entityMarker, isEntityMarker }
export type { EntityMarker }
