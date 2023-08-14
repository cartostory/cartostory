import type { useEditor } from '@tiptap/react'
import { EditorContent, BubbleMenu } from '@tiptap/react'
import { ReactComponent as MapPinAddLine } from '../../../../../assets/map-pin-add-line.svg'
import { ReactComponent as MapPinRemoveLine } from '../../../../../assets/map-pin-remove-line.svg'
import { ReactComponent as CropLine } from '../../../../../assets/crop-line.svg'
import {
  isCenteredOnFeature,
  selectionHasFeature,
} from '../../../../../lib/state/story'
import { useAction, useStoryContext } from '../../providers/story-provider'
import { useActor, useSelector } from '@xstate/react'
import React from 'react'
import type { EntityMarker } from '../../../../../lib/editor'
import { isEntityMarker } from '../../../../../lib/editor'
import { MenuBar } from './components'

function Editor({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const storyMachine = useStoryContext()
  const [state] = useActor(storyMachine)
  const {
    removeFeature,
    startFeatureAddition,
    reset,
    centerMap,
    clearSelection,
    selectWithFeature,
    selectWithNoFeature,
  } = useAction()
  const selectionWithFeature = useSelector(storyMachine, selectionHasFeature)
  const isCentered = useSelector(storyMachine, isCenteredOnFeature)
  const MarkerIcon = selectionWithFeature ? (
    <MapPinRemoveLine />
  ) : (
    <MapPinAddLine />
  )
  const feature =
    isCentered &&
    state.context.feature?.target === 'story' &&
    isEntityMarker(state.context.feature.feature)
      ? state.context.feature.feature
      : undefined
  useHighlight(feature)

  return (
    <>
      <MenuBar editor={editor} />
      {editor ? (
        <BubbleMenu
          tippyOptions={{
            offset: [-20, -65],
            zIndex: 1,
          }}
          editor={editor}
          className="ml-12 bg-white border flex space-x-5 px-2 py-1 drop-shadow"
        >
          <button
            data-testid={`pin-${selectionWithFeature ? 'remove' : 'add'}`}
            onClick={() => {
              if (selectionWithFeature) {
                const featureIdAttribute =
                  editor?.getAttributes('feature')?.['data-feature-id']
                removeFeature(featureIdAttribute)
              } else {
                startFeatureAddition(editor.commands.setMarker)
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
      <div className="overflow-auto grow" onScroll={reset}>
        <EditorContent
          style={{ minHeight: '1000px' }}
          onClick={() => {
            const emptySelection = editor?.view.state.selection.empty
            const featureId =
              editor?.getAttributes('feature')?.['data-feature-id']

            if (featureId) {
              centerMap(featureId)
            }

            if (emptySelection) {
              clearSelection()
            } else {
              if (featureId) {
                selectWithFeature(featureId, editor.commands.toggleMarker)
              } else {
                selectWithNoFeature()
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

function useHighlight(feature?: EntityMarker) {
  React.useEffect(() => {
    if (!feature) {
      return
    }

    const selector = `[data-feature-id="${feature.feature!.properties.id}"]`
    const elm = document.querySelector(selector)
    const highlight = 'text-red-500'

    if (!elm) {
      return
    }

    elm.scrollIntoView({ behavior: 'smooth' })
    elm.classList.add(highlight)

    setTimeout(() => {
      elm.classList.remove(highlight)
    }, 1000)
  }, [feature])
}

export { Editor }
