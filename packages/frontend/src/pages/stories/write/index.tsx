import React from 'react'
import L from 'leaflet'
import { MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import { UploadButton } from './components'
import { MapLayers } from './components/map-layers'
import { ReactComponent as Link } from '../../../assets/link.svg'
import { deburr as _deburr, kebabCase as _kebabCase } from 'lodash-es'
import { randomString } from '../../../utils'

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

const urlSuffix = randomString(6)

function Write() {
  const [title, setTitle] = useTitle()
  const urlSlug = _deburr(_kebabCase(title))
  const url = `${urlSlug}-${urlSuffix}`

  return (
    <div className="w-full flex">
      <div className="w-1/2 bg-gray-200">
        <MapContainer className="h-screen" center={[51.505, -0.09]} zoom={13}>
          <UploadButton />
          <MapLayers />
        </MapContainer>
        <div
          aria-hidden
          className="absolute top-0 z-[10000] w-[10px] h-[100vh] right-1/2 pointer-events-none"
          style={{ boxShadow: 'inset -5px 0px 3px 0px rgba(0, 0, 0, .15)' }}
        />
      </div>
      <div className="w-1/2 p-5 px-10">
        <form>
          <input
            value={title}
            onChange={setTitle}
            style={{ fontFamily: 'Phenomena' }}
            className="w-full py-2 text-4xl bg-transparent border-0 border-b-2 text-gray-500 font-bold focus:outline-none"
            type="text"
            placeholder="Your story title"
          />
        </form>
        <p className="flex space-x-2 text-gray-500 my-3">
          {title.length > 0 ? (
            <>
              <Link />
              <small>your story URL: {url}</small>
            </>
          ) : null}
        </p>
      </div>
    </div>
  )
}

function useTitle(): [string, React.FormEventHandler<HTMLInputElement>] {
  const [title, setTitle] = React.useState('')

  const handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    setTitle(e.currentTarget.value)
  }

  return [title, handleChange]
}

export { Write }
