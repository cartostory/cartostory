import L from 'leaflet'
import React from 'react'
import { useMap } from 'react-leaflet'
import Upload from '../../../../../assets/upload.svg'
import { trackOptions } from '../../../../../config'

type FileReaderProgressEvent = ProgressEvent<FileReader>
type FileReaderProgressEventTarget = Exclude<
  FileReaderProgressEvent['target'],
  null
>
type FileReaderResult = Extract<FileReaderProgressEventTarget['result'], string>

type FileReadingStatus =
  | { status: 'done'; result?: FileReaderResult }
  | ({ status: 'loading' } & Pick<FileReaderProgressEvent, 'loaded' | 'total'>)
  | { status: 'error' }

const positionClassnames = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

function UploadButton({
  position = 'topleft',
}: {
  position?: keyof typeof positionClassnames
}) {
  const [file, selectFile] = useSelectFile()
  const content = useReadFile(file)
  useLoadGeoJson(content?.status === 'done' ? content.result : undefined)

  const uploadElement = (
    <>
      <input
        onChange={selectFile}
        type="file"
        name="track"
        accept=".json"
        className="opacity-0 absolute w-[32px] h-[32px] cursor-pointer"
      />
      <img src={Upload} className="basis-5" />
    </>
  )

  const children: {
    [key in FileReadingStatus['status'] | 'unknown']: JSX.Element
  } = {
    done: uploadElement,
    error: <>oh no</>,
    loading: <Loader />,
    unknown: uploadElement,
  }

  return (
    <div className={positionClassnames[position]}>
      <div className="leaflet-control leaflet-bar bg-white h-[32px] w-[32px] top-[73px] flex justify-center">
        {children[content?.status ?? 'unknown']}
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="spinner self-center shrink-0 animate-upload-button-loading border-black border-2 rounded-full w-[20px] h-[20px]"></div>
  )
}

function useSelectFile(): [
  File | undefined,
  React.ChangeEventHandler<HTMLInputElement>,
] {
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

function useReadFile(file?: File) {
  const reader = React.useRef(new FileReader())
  const [result, setResult] = React.useState<FileReadingStatus | undefined>()

  React.useEffect(() => {
    if (!file) {
      return
    }

    const readerInstance = reader.current

    const handler = (e: ProgressEvent<FileReader>) => {
      switch (e.type) {
        case 'load':
          setResult({
            status: 'done',
            result: e.target?.result?.toString(),
          })
          break
        case 'progress':
          setResult({
            status: 'loading',
            loaded: e.loaded,
            total: e.total,
          })
          break
        case 'error':
          setResult({
            status: 'error',
          })
      }
    }

    readerInstance.addEventListener('load', handler)
    readerInstance.addEventListener('progress', handler)
    readerInstance.readAsText(file)

    return () => {
      readerInstance.removeEventListener('load', handler)
    }
  }, [file])

  return result
}

function useLoadGeoJson(data?: string) {
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

export { UploadButton }
