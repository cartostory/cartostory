import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ReactComponent as MapPinAddLine } from '../../../../../assets/map-pin-add-line.svg'
import { ReactComponent as MapPinRemoveLine } from '../../../../../assets/map-pin-remove-line.svg'
import { ReactComponent as CropLine } from '../../../../../assets/crop-line.svg'
import { FeatureMark } from './feature-mark'
import {
  isCenteredOnFeature,
  selectionHasFeature,
} from '../../../../../lib/state/story'
import { useStoryContext } from '../../providers/story-provider'
import { useActor, useSelector } from '@xstate/react'
import React from 'react'
import { isEntityMarker } from '../../../../../lib/editor'
import { MenuBar } from './components'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, FeatureMark],
    content: '<p>Hello World!</p>',
  })
  const storyMachine = useStoryContext()
  const [state, send] = useActor(storyMachine)
  const selectionWithFeature = useSelector(storyMachine, selectionHasFeature)
  const isCentered = useSelector(storyMachine, isCenteredOnFeature)
  const MarkerIcon = selectionWithFeature ? (
    <MapPinRemoveLine />
  ) : (
    <MapPinAddLine />
  )

  React.useEffect(() => {
    if (
      !(
        isCentered &&
        state.context.feature?.target === 'story' &&
        isEntityMarker(state.context.feature.feature)
      )
    ) {
      return
    }

    const elm = document.querySelector(
      `[data-feature-id="${state.context.feature.feature.options.id}"]`,
    )

    if (!elm) {
      return
    }

    elm.scrollIntoView({ behavior: 'smooth' })
  }, [
    isCentered,
    state.context.feature?.feature,
    state.context.feature?.feature.options.id,
    state.context.feature?.target,
  ])

  return (
    <>
      <MenuBar editor={editor} />
      {editor ? (
        <BubbleMenu
          editor={editor}
          className="ml-12 bg-white border flex space-x-5 px-2 py-1 drop-shadow"
        >
          <button
            data-testid={`pin-${selectionWithFeature ? 'remove' : 'add'}`}
            onClick={() => {
              if (selectionWithFeature) {
                const featureIdAttribute =
                  editor?.getAttributes('feature')?.['data-feature-id']
                send({
                  type: 'REMOVE_FEATURE',
                  id: featureIdAttribute,
                })
              } else {
                send({
                  type: 'START_FEATURE_ADDITION',
                  callback: editor.commands.setMarker,
                })
              }
            }}
          >
            {MarkerIcon}
          </button>
          <button
            onClick={() => {
              console.log('todo add bounding box')
            }}
          >
            <CropLine />
          </button>
        </BubbleMenu>
      ) : null}
      <div
        className="overflow-auto grow"
        onScroll={() => {
          send('RESET')
        }}
      >
        <EditorContent
          className="mt-12"
          style={{ minHeight: '1000px' }}
          onClick={() => {
            const emptySelection = editor?.view.state.selection.empty
            const featureId =
              editor?.getAttributes('feature')?.['data-feature-id']

            if (featureId) {
              send({
                type: 'CENTER_ON_FEATURE',
                id: featureId,
                target: 'map',
              })
            }

            if (emptySelection) {
              send('UNSELECT')
            } else {
              if (featureId) {
                send({
                  type: 'SELECT_WITH_FEATURE_ALREADY',
                  featureId: featureId,
                  callback: editor.commands.toggleMarker,
                })
              } else {
                send('SELECT_WITH_NO_FEATURE_YET')
              }
            }
          }}
          editor={editor}
          data-testid="editor"
        />
      </div>
    </>
  )
}

export { Editor }
