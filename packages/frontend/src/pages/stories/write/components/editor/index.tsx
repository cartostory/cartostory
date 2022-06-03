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
import { useAction, useStoryContext } from '../../providers/story-provider'
import { useActor, useSelector } from '@xstate/react'
import React from 'react'
import type { EntityMarker } from '../../../../../lib/editor'
import { isEntityMarker } from '../../../../../lib/editor'
import { MenuBar } from './components'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, FeatureMark],
    content: `
    <h1>Lorem ipsum dolor sit amet</h1>
    <p>consectetur adipiscing elit. Nam nec urna euismod, placerat felis at, blandit nulla. Maecenas posuere volutpat est ac vulputate. Maecenas sed nunc lacus. Vestibulum eget tortor nibh. Integer consequat efficitur felis non finibus. Praesent vehicula hendrerit nibh ac ultrices. Praesent diam nisi, congue a urna eu, rhoncus finibus dui.</p>
    <h2>Ut laoreet venenatis nunc</h2>
    <ul>
      <li>hello world</li>
      <li>hello world</li>
      <li>hello world</li>
      <li>hello world</li>
    </ul>
    <p>ac sagittis libero pharetra sed. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.  Phasellus a cursus nisi. Vivamus sit amet mi tincidunt, euismod eros nec, imperdiet dolor. Duis ut vestibulum leo. Nunc sed sem at orci mollis pretium nec vitae ante. Duis quis fermentum odio. Etiam ut ipsum scelerisque, tristique leo ac, placerat turpis. Nam in nisl sem. Praesent et mollis justo, vel tempor odio. Donec porta cursus tortor, at facilisis risus ultrices vitae. Donec maximus pellentesque dolor vel interdum.</p>
    <p>Vivamus ac mauris vitae tortor cursus convallis sed vitae lacus.
      <h3>Sed aliquam, sem et ultrices convallis</h3><p> elit diam volutpat justo, a bibendum velit metus quis diam. Vestibulum ante leo, porttitor pellentesque sapien vitae, posuere ullamcorper purus.
        <h4>Aenean sed lectus vel odio laoreet maximus.</h4>
        <p>Aliquam id sem rutrum, vestibulum elit vitae, elementum tortor. Vestibulum consequat at ipsum vel accumsan.  Donec nec lacus diam. Sed et efficitur lacus. Donec non tristique risus. Nam est odio, molestie eu pellentesque eget, aliquet sit amet augue. Pellentesque molestie et dolor sit amet laoreet. Sed varius porttitor ex, eu venenatis nunc lacinia at. Quisque et diam quis dui vehicula ultricies. Praesent vitae viverra turpis.</p>
        <h5>Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</h5>
        <p>Integer sit amet leo rutrum nisl interdum porta at nec turpis. Aliquam convallis ornare malesuada. Etiam laoreet, nulla eu volutpat aliquet, velit enim pharetra orci, ut consequat quam odio vitae justo.  Mauris ac arcu vel enim interdum varius laoreet in metus. Vivamus non ipsum finibus, interdum justo sed, pulvinar sapien. In justo ipsum, aliquet at auctor posuere, ultrices tempor mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam sem nisi, pretium non nunc eu, eleifend gravida nisi. Praesent tempus tincidunt justo, a bibendum arcu imperdiet semper. Maecenas venenatis fringilla neque. Sed eros tellus, rhoncus eget varius non, ultrices quis urna. Curabitur aliquam sapien ut vestibulum sollicitudin. Nullam nec elementum tortor, a lacinia felis. Donec feugiat efficitur sapien, a consectetur nibh commodo sed. Vivamus ac turpis vitae metus malesuada venenatis a a neque.  Nullam felis ante, imperdiet eu ullamcorper vitae, eleifend vel nulla. Praesent ante enim, cursus sed tempus et, laoreet id ante. Phasellus id pellentesque sem. Curabitur sagittis sed lorem vel venenatis. Mauris eget enim eget lacus convallis dapibus dictum a magna. Proin mollis arcu quam, in egestas nisl imperdiet in. Aliquam erat volutpat. Proin et vulputate justo. Curabitur vel euismod est.</p>`,
  })
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
