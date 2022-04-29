import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useWriteContext } from '../..'
import { ReactComponent as Bold } from '../../../../../assets/bold.svg'
import { ReactComponent as Italic } from '../../../../../assets/italic.svg'
import { ReactComponent as H1 } from '../../../../../assets/h-1.svg'
import { ReactComponent as H2 } from '../../../../../assets/h-2.svg'
import { ReactComponent as H3 } from '../../../../../assets/h-3.svg'
import { ReactComponent as H4 } from '../../../../../assets/h-4.svg'
import { ReactComponent as H5 } from '../../../../../assets/h-5.svg'
import { ReactComponent as H6 } from '../../../../../assets/h-6.svg'
import { ReactComponent as ListOrdered } from '../../../../../assets/list-ordered.svg'
import { ReactComponent as ListUnordered } from '../../../../../assets/list-unordered.svg'
import { ReactComponent as MapPinAddLine } from '../../../../../assets/map-pin-add-line.svg'
import { ReactComponent as CropLine } from '../../../../../assets/crop-line.svg'
import { TestMark } from './test-mark'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, TestMark],
    content: '<p>Hello World!</p>',
  })
  const { addMarker, addRectangle, setCallback } = useWriteContext()

  return (
    <>
      <MenuBar editor={editor} />
      {editor ? (
        <BubbleMenu
          editor={editor}
          className="bg-white border flex space-x-5 px-2 py-1 drop-shadow"
        >
          <button
            onClick={() => {
              console.log(
                'editor.commands.setFeatureMark',
                editor.commands.setTest,
              )
              setCallback(() => editor.commands.setTest)
              addMarker()
            }}
          >
            <MapPinAddLine />
          </button>
          <button onClick={() => addRectangle()}>
            <CropLine />
          </button>
        </BubbleMenu>
      ) : null}
      <div className="overflow-auto grow">
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const classes = 'border px-2 py-1'
  if (!editor) {
    return null
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${editor.isActive('bold') ? 'is-active' : ''} ${classes}`}
      >
        <Bold className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${editor.isActive('italic') ? 'is-active' : ''} ${classes}`}
      >
        <Italic className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${
          editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H1 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${
          editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H2 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H3 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${
          editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H4 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${
          editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H5 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
        } ${classes}`}
      >
        <H6 className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor.isActive('bulletList') ? 'is-active' : ''
        } ${classes}`}
      >
        <ListUnordered className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor.isActive('orderedList') ? 'is-active' : ''
        } ${classes}`}
      >
        <ListOrdered className="w-[18px] h-[18px]" />
      </button>
    </div>
  )
}

export { Editor }
