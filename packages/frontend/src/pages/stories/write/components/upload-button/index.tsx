import L from 'leaflet'
import React from 'react'
import { useMap } from 'react-leaflet'
import Upload from '../../../../../assets/upload.svg'
import { trackOptions } from '../../../../../config'

const positionClassnames = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const useSelectFile = (): [
  File | undefined,
  React.ChangeEventHandler<HTMLInputElement>,
] => {
  const [file, setFile] = React.useState<File | undefined>()
  const handler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files

      if (!files) {
        return
      }

      setFile(files[0])
    },
    [],
  )

  return [file, handler]
}

const useReadFile = (file?: File) => {
  const reader = React.useRef(new FileReader())
  const [content, setContent] = React.useState<string | undefined>()

  React.useEffect(() => {
    if (!file) {
      return
    }

    const readerInstance = reader.current

    const handler = (e: ProgressEvent<FileReader>) => {
      setContent(e.target?.result?.toString())
    }

    readerInstance.addEventListener('load', handler)
    readerInstance.readAsText(file)

    return () => {
      readerInstance.removeEventListener('load', handler)
    }
  }, [file])

  return content
}

const useLoadGeoJson = (data?: string) => {
  const trackRef = React.useRef<L.GeoJSON<unknown>>()
  const map = useMap()

  if (!data) {
    return
  }

  if (trackRef.current) {
    map.removeLayer(trackRef.current)
  }

  trackRef.current = new L.GeoJSON(JSON.parse(data.toString()), {
    style: trackOptions.style.plain,
  })

  map.addLayer(trackRef.current)
  map.flyToBounds(trackRef.current.getBounds())
}

const UploadButton = ({
  position = 'topleft',
}: {
  position?: keyof typeof positionClassnames
}) => {
  const [file, selectFile] = useSelectFile()
  const content = useReadFile(file)
  useLoadGeoJson(content)

  return (
    <div className={positionClassnames[position]}>
      <div className="leaflet-control leaflet-bar bg-white h-[32px] w-[32px] top-[73px] flex justify-center">
        <input
          onChange={selectFile}
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
