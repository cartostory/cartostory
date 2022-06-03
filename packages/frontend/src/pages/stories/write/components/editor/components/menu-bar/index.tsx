import type { useEditor } from '@tiptap/react'
import { ReactComponent as Bold } from '../../../../../../../assets/bold.svg'
import { ReactComponent as Italic } from '../../../../../../../assets/italic.svg'
import { ReactComponent as H1 } from '../../../../../../../assets/h-1.svg'
import { ReactComponent as H2 } from '../../../../../../../assets/h-2.svg'
import { ReactComponent as H3 } from '../../../../../../../assets/h-3.svg'
import { ReactComponent as H4 } from '../../../../../../../assets/h-4.svg'
import { ReactComponent as H5 } from '../../../../../../../assets/h-5.svg'
import { ReactComponent as H6 } from '../../../../../../../assets/h-6.svg'
import { ReactComponent as ListOrdered } from '../../../../../../../assets/list-ordered.svg'
import { ReactComponent as ListUnordered } from '../../../../../../../assets/list-unordered.svg'

const classes = {
  button: 'border px-2 py-1',
  icon: 'w-[18px] h-[18px]',
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex space-x-2 z-[2] relative bg-white mb-5">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${editor.isActive('bold') ? 'is-active' : ''} ${
          classes.button
        }`}
      >
        <Bold className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${editor.isActive('italic') ? 'is-active' : ''} ${
          classes.button
        }`}
      >
        <Italic className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${
          editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H1 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${
          editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H2 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H3 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${
          editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H4 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${
          editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H5 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
        } ${classes.button}`}
      >
        <H6 className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${editor.isActive('bulletList') ? 'is-active' : ''} ${
          classes.button
        }`}
      >
        <ListUnordered className={classes.icon} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${editor.isActive('orderedList') ? 'is-active' : ''} ${
          classes.button
        }`}
      >
        <ListOrdered className={classes.icon} />
      </button>
      <button form="story-form" className={classes.button}>
        save me
      </button>
    </div>
  )
}

export { MenuBar }
