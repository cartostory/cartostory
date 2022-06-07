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
import { useMutation } from 'react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import { myAxios } from '../../../../../api'
import { isEntityMarker } from '../../../../../lib/editor'
import { useFormValidation } from '../../../../../hooks'
import { Form, Message } from '../../../../../components'

type Payload = {
  slug: string
  story: {
    title: string
    text: Record<string, unknown>
    map: Record<'features', unknown>
  }
}

function Story() {
  const machine = useStoryContext()
  const storyMutation = useSaveStory()
  const editor = useEditor({
    extensions: [StarterKit, FeatureMark],
    content,
  })
  const [slug, setSlug] = useSlug()
  const [errors, validate] = useFormValidation<'title' | 'slug'>()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement> & {
      target: { elements: Record<'title', HTMLInputElement> }
    },
  ) => {
    e.preventDefault()
    const { title } = e.target.elements

    if (!validate([title])) {
      return
    }

    const { features } = machine.state.context
    const payload: Payload = {
      slug: slug!,
      story: {
        title: e.target.elements.title.value,
        text: editor!.getJSON(),
        map: {
          features: features.filter(isEntityMarker).map(f => f.toGeoJSON()),
        },
      },
    }
    storyMutation.mutate(payload)
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        id="story-form"
        className="relative z-[2] mt-0 mx-0 border-0 px-0"
      >
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
        {errors.title ? (
          <Message mode="inline" level="error">
            {errors.title}
          </Message>
        ) : null}
      </Form>
      <p className="flex space-x-2 text-gray-500 py-3 bg-white z-[2] relative">
        {slug ? (
          <>
            <Link />
            <small>
              your story URL:{' '}
              <input
                className="focus:outline-none"
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

// TODO drop this and get the random string from the backend instead
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

function useSaveStory() {
  const mutation = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    Payload
  >(async data => myAxios.post('/stories', data))

  return mutation
}

export { Story }
