import React from 'react'
import { ReactComponent as Link } from '../../../assets/link.svg'
import { deburr as _deburr, kebabCase as _kebabCase } from 'lodash-es'
import { randomString } from '../../../utils'
import { Editor } from './components/editor'
import { Map } from './components/map'
import { StoryProvider } from './providers/story-provider'

const urlSuffix = randomString(6)

function Write() {
  const [title, setTitle] = useTitle()
  const urlSlug = _deburr(_kebabCase(title))
  const url = `${urlSlug}-${urlSuffix}`

  return (
    <StoryProvider>
      <div className="w-full flex">
        <div className="w-1/2 bg-gray-200">
          <Map />
          <div
            aria-hidden
            className="absolute top-0 z-[10000] w-[10px] h-[100vh] right-1/2 pointer-events-none"
            style={{ boxShadow: 'inset -5px 0px 3px 0px rgba(0, 0, 0, .15)' }}
          />
        </div>
        <div className="w-1/2 p-5 px-10 flex flex-col h-[100vh]">
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
          <Editor />
        </div>
      </div>
    </StoryProvider>
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
