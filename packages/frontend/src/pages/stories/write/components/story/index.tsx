import { deburr as _deburr, kebabCase as _kebabCase } from 'lodash-es'
import { Editor } from '../editor'
import { ReactComponent as Link } from '../../../../../assets/link.svg'
import { randomString } from '../../../../../utils'
import React from 'react'
import { useStoryContext } from '../../providers/story-provider'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FeatureMark } from '../editor/feature-mark'
import { content } from './content'

function Story() {
  const machine = useStoryContext()
  const editor = useEditor({
    extensions: [StarterKit, FeatureMark],
    content,
  })
  const [slug, setSlug] = useSlug()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const { features } = machine.state.context
    const payload = {
      slug: e.target.elements.slug.value,
      story: {
        title: e.target.elements.title.value,
        text: editor!.getJSON(),
        map: {
          features: features.map(f => f.toGeoJSON()),
        },
      },
    }
    console.log('submit', payload)
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="story-form" className="relative z-[2]">
        <input
          autoComplete="off"
          className="w-full py-2 text-4xl bg-white border-0 border-b-2 text-gray-500 font-bold focus:outline-none"
          name="title"
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
            <small>
              your story URL:{' '}
              <input
                form="story-form"
                name="slug"
                readOnly
                type="text"
                value={slug}
              />
            </small>
          </>
        ) : null}
      </p>
      <Editor editor={editor} />
    </>
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

export { Story }
