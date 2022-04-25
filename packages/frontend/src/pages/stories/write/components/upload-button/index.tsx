import { motion, useAnimation } from 'framer-motion'
import L from 'leaflet'
import React from 'react'
import { useMap } from 'react-leaflet'
import Check from '../../../../../assets/check.svg'
import Upload from '../../../../../assets/upload.svg'
import X from '../../../../../assets/x.svg'
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

type FileReadingStatusKeys = FileReadingStatus['status']

const positionClassnames = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const UploadContext = React.createContext<
  | (ReturnType<typeof useSelectFile> &
      ReturnType<typeof useReadFile> &
      ReturnType<typeof useLoadGeoJson>)
  | undefined
>(undefined)

function useUploadContext() {
  const context = React.useContext(UploadContext)

  if (!context) {
    throw new Error('UploadContext is only available inside UploadProvider.')
  }
}

function UploadProvider({ children }: React.PropsWithChildren<unknown>) {
  const [file, selectFile] = useSelectFile()
  const content = useReadFile(file)
  const loaded = useLoadGeoJson(
    content?.status === 'done' ? content.result : undefined,
  )
  return (
    <UploadContext.Provider value={{ file, selectFile, content, loaded }}>
      {children}
    </UploadContext.Provider>
  )
}

function UploadButton({
  position = 'topleft',
}: {
  position?: keyof typeof positionClassnames
}) {
  const [file, selectFile] = useSelectFile()
  const content = useReadFile(file)
  const loaded = useLoadGeoJson(
    content?.status === 'done' ? content.result : undefined,
  )

  const children: {
    [key in FileReadingStatus['status'] | 'unknown']: JSX.Element
  } = {
    done: <UploadElement selectFile={selectFile} loaded={loaded} file={file} />,
    error: <>oh no</>,
    loading: <Loader />,
    unknown: (
      <UploadElement selectFile={selectFile} loaded={loaded} file={file} />
    ),
  }

  return (
    <UploadProvider>
      <div className={positionClassnames[position]}>
        <div className="leaflet-control leaflet-bar bg-white h-[32px] w-[32px] top-[73px] flex justify-center">
          {children[content?.status ?? 'unknown']}
        </div>
      </div>
    </UploadProvider>
  )
}

function Loader() {
  return (
    <div className="spinner self-center shrink-0 animate-upload-button-loading border-black border-2 rounded-full w-[20px] h-[20px]" />
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
  const [result, setResult] = React.useState<
    Extract<FileReadingStatusKeys, 'error' | 'done'> | undefined
  >()
  const trackRef = React.useRef<L.GeoJSON<unknown>>()
  const map = useMap()

  React.useEffect(() => {
    if (!data) {
      return
    }

    if (trackRef.current) {
      map.removeLayer(trackRef.current)
    }

    try {
      trackRef.current = new L.GeoJSON(JSON.parse(data.toString()), {
        style: trackOptions.style.plain,
      })

      map.addLayer(trackRef.current)
      map.flyToBounds(trackRef.current.getBounds())
      setResult('done')
    } catch (e) {
      // TODO pass error message to user console.log(e instanceof SyntaxError)
      setResult('error')
    }
  }, [data, map])

  return result
}

function useUploadResultAnimation(
  file: ReturnType<typeof useSelectFile>['0'],
  loaded: ReturnType<typeof useLoadGeoJson>,
) {
  const uploadElementControls = useAnimation()
  const uploadStatusControls = useAnimation()

  React.useEffect(() => {
    if (!loaded) {
      return
    }

    async function start() {
      console.log('start')
      uploadStatusControls.set({ scale: 0, display: 'none' })
      await uploadElementControls.start({
        scale: 0,
      })
    }

    async function switchElements() {
      console.log('switchElements')
      uploadElementControls.set({ display: 'none' })
      uploadStatusControls.set({ display: 'initial' })
      return uploadStatusControls.start({
        scale: 1,
      })
    }

    async function keepStatusVisible() {
      console.log('keepStatusVisible')
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true)
        }, 3000)
      })
    }

    async function switchElementsBack() {
      console.log('switchElementsBack')
      return uploadStatusControls.start({
        scale: 0,
      })
    }

    async function reset() {
      console.log('reset')
      uploadStatusControls.set({ display: 'none' })
      uploadElementControls.set({ display: 'initial' })
      return uploadElementControls.start({ scale: 1 })
    }

    start()
      .then(switchElements)
      .then(keepStatusVisible)
      .then(switchElementsBack)
      .then(reset)
      .catch(() => {})
  }, [uploadElementControls, uploadStatusControls, loaded, file])

  return { uploadStatusControls, uploadElementControls }
}

function UploadElement({
  file,
  loaded,
  selectFile,
}: {
  file: ReturnType<typeof useSelectFile>['0']
  loaded: ReturnType<typeof useLoadGeoJson>
}) {
  const { uploadElementControls, uploadStatusControls } =
    useUploadResultAnimation(file, loaded)
  return (
    <>
      <input
        onChange={selectFile}
        type="file"
        name="track"
        accept=".json"
        className="opacity-0 absolute w-[32px] h-[32px] cursor-pointer"
      />
      <motion.img
        src={Upload}
        className="basis-5 block"
        animate={uploadElementControls}
        onAnimationStart={() => console.log('uploadElementControls started')}
        onAnimationComplete={() => console.log('uploadElementControls ended')}
      />
      {loaded ? (
        <motion.img
          animate={uploadStatusControls}
          src={loaded === 'error' ? X : Check}
          className="basis-5 block"
          onAnimationStart={() => console.log('uploadStatusControls started')}
          onAnimationComplete={() => console.log('uploadStatusControls ended')}
        />
      ) : null}
    </>
  )
}

export { UploadButton }
