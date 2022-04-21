import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'

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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/cartostory/cjugqcypf27581gnry4y59lxy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FydG9zdG9yeSIsImEiOiJjanQycXVyZDcxeXZqM3lxeDNvcW81NWJpIn0.hfvoqNSy7dT0yviVhNcDMg"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="w-1/2 bg-blue-200">story</div>
    </div>
  )
}

export { Write }
