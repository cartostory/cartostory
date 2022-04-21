import L from 'leaflet'
import React from 'react'
import { useMap } from 'react-leaflet'
import Upload from '../../../../../assets/upload.svg'

const positionClassnames = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const useUploadTrack = () => {
  const trackRef = React.useRef<L.GeoJSON<unknown>>()
  const map = useMap()

  const readFile = React.useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result

        if (!result) {
          return
        }

        if (trackRef.current) {
          map.removeLayer(trackRef.current)
        }

        trackRef.current = new L.GeoJSON(JSON.parse(result.toString()))
        map.addLayer(trackRef.current)
      })

      reader.readAsText(file)
    },
    [map],
  )

  const handler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files

      if (!files) {
        return
      }

      const file = files[0]
      readFile(file)
    },
    [readFile],
  )

  return handler
}

const UploadButton = ({
  position = 'topleft',
}: {
  position?: keyof typeof positionClassnames
}) => {
  const handleUpload = useUploadTrack()

  return (
    <div className={positionClassnames[position]}>
      <div className="leaflet-control leaflet-bar bg-white h-[32px] w-[32px] top-[73px] flex justify-center">
        <input
          onChange={handleUpload}
          type="file"
          name="track"
          accept=".json"
          className="opacity-0 absolute w-[32px] h-[32px] cursor-pointer"
        />
        <img src={Upload} className="basis-5" />
      </div>
    </div>
  )
}

export { UploadButton }
