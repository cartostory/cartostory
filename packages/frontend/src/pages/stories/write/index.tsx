import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import Upload from '../../../assets/upload.svg'

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

const UploadButtonControl = L.Control.extend({
  initialize: function (options: L.ControlOptions) {
    L.Util.setOptions(this, options)
  },
  onAdd: function () {
    const div = L.DomUtil.create(
      'div',
      'leaflet-bar bg-white w-[32px] h-[32px] flex justify-center',
    )
    const button = L.DomUtil.create(
      'input',
      'opacity-0 absolute w-[32px] h-[32px] cursor-pointer',
      div,
    )
    button.name = 'track'
    button.type = 'file'
    button.accept = '.json'
    const img = L.DomUtil.create('img', 'basis-5', div)
    img.src = Upload
    // @ts-expect-error error
    button.onchange = this.options.onChange

    return div
  },
})

// @ts-expect-error
const createUploadButton = props =>
  new UploadButtonControl({ position: 'topleft', ...props })
const UploadButton = createControlComponent(createUploadButton)

const Write = (): JSX.Element => {
  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
      console.log('load', e.target?.result)
    })

    reader.readAsText(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files

    if (!files) {
      return
    }

    const file = files[0]
    readFile(file)
  }

  return (
    <div className="w-full flex">
      <div className="w-1/2 bg-gray-200">
        <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
          <UploadButton onChange={handleChange} />
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
