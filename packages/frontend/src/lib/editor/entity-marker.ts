import L from 'leaflet'
import { randomString } from '../../utils'

class EntityMarker extends L.Marker {
  options: L.MarkerOptions & { id: string } = {
    id: randomString(6),
  }

  constructor(latLng: L.LatLngExpression, options?: L.MarkerOptions) {
    super(latLng, options)
  }
}

function entityMarker(
  latLng: L.LatLngExpression,
  options?: L.MarkerOptions & { id: string },
) {
  return new EntityMarker(latLng, options)
}

function isEntityMarker(obj: L.Marker | L.Rectangle): obj is EntityMarker {
  return 'id' in obj.options
}

export { entityMarker, isEntityMarker }
export type { EntityMarker }
