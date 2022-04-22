import L from 'leaflet'
import { MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import { UploadButton } from './components'
import { MapLayers } from './components/map-layers'

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

const Write = (): JSX.Element => {
  return (
    <div className="w-full flex">
      <div className="w-1/2 bg-gray-200">
        <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
          <UploadButton />
          <MapLayers />
        </MapContainer>
      </div>
      <div className="w-1/2 bg-blue-200">story</div>
    </div>
  )
}

export { Write }
