import React from 'react'
import { ReactComponent as Link } from '../../../assets/link.svg'
import { deburr as _deburr, kebabCase as _kebabCase } from 'lodash-es'
import { randomString } from '../../../utils'
import { Editor } from './components/editor'
import { Map } from './components/map'
import { ActionProvider, StoryProvider } from './providers/story-provider'
import { Map, Shadow, Story } from './components'

function Write() {
  const [slug, setSlug] = useSlug()

  return (
    <StoryProvider>
      <ActionProvider>
        <div className="w-full flex">
          <div className="w-1/2 bg-gray-200">
            <Map />
            <Shadow />
          </div>
          <div className="w-1/2 p-5 px-10 flex flex-col h-[100vh]">
            <form
              onSubmit={e => {
                e.preventDefault()
                console.log(e.target)
              }}
              id="story-form"
              className="relative z-[2]"
            >
              <input
                className="w-full py-2 text-4xl bg-white border-0 border-b-2 text-gray-500 font-bold focus:outline-none"
                onChange={setSlug}
                placeholder="Your story title"
                required
                style={{ fontFamily: 'Phenomena' }}
                type="text"
              />
            </form>
            <p className="flex space-x-2 text-gray-500 py-3 bg-white z-[2] relative">
              {slug ? (
                <>
                  <Link />
                  <small>your story URL: {slug}</small>
                </>
              ) : null}
            </p>
            <Editor />
            <button
              form="story-form"
              className="absolute shadow-md bottom-5 right-5 p-2 bg-white"
            >
              save me
            </button>
          </div>
        </div>
      </ActionProvider>
    </StoryProvider>
  )
}

const urlSuffix = randomString(6)

function useSlug(): [
  string | undefined,
  React.FormEventHandler<HTMLInputElement>,
] {
  const [slug, setSlug] = React.useState('')

  const handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    setSlug(_deburr(_kebabCase(e.currentTarget.value)))
  }

  return [slug ? `${slug}-${urlSuffix}` : undefined, handleChange]
}

export { Write }
