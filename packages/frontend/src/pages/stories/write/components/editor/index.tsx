import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useWriteContext } from '../..'
import { ReactComponent as Bold } from '../../../../../assets/bold.svg'
import { ReactComponent as Italic } from '../../../../../assets/italic.svg'
import { ReactComponent as List } from '../../../../../assets/list.svg'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })
  const { startEditing } = useWriteContext()

  return (
    <>
      <MenuBar editor={editor} />
      {editor ? (
        <BubbleMenu editor={editor} className="bg-white">
          <button onClick={() => startEditing()}>add marker</button>
          <button>add bounding box</button>
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
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${editor.isActive('italic') ? 'is-active' : ''} ${classes}`}
      >
        <Italic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${
          editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${
          editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${
          editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${
          editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
        } ${classes}`}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor.isActive('bulletList') ? 'is-active' : ''
        } ${classes}`}
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor.isActive('orderedList') ? 'is-active' : ''
        } ${classes}`}
      >
        1.
      </button>
    </div>
  )
}

export { Editor }
