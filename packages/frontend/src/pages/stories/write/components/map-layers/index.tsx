import { TileLayer } from 'react-leaflet'

const layers = [
  {
    id: 'mapbox-base-layer',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://api.mapbox.com/styles/v1/cartostory/cjugqcypf27581gnry4y59lxy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FydG9zdG9yeSIsImEiOiJjanQycXVyZDcxeXZqM3lxeDNvcW81NWJpIn0.hfvoqNSy7dT0yviVhNcDMg',
  },
  {
    id: 'mtbmap-hiking-layer',
    url: 'http://tile.mtbmap.cz/overlay_hiking/{z}/{x}/{y}.png',
  },
  {
    id: 'mapbox-labels-layer',
    url: 'https://api.mapbox.com/styles/v1/cartostory/cjugqfe8r1lhh1ftgrmr7v9zj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FydG9zdG9yeSIsImEiOiJjanQycXVyZDcxeXZqM3lxeDNvcW81NWJpIn0.hfvoqNSy7dT0yviVhNcDMg',
  },
]

function MapLayers() {
  return (
    <>
      {layers.map(({ id, ...layer }) => (
        <TileLayer key={id} {...layer} />
      ))}
    </>
  )
}

export { MapLayers }
