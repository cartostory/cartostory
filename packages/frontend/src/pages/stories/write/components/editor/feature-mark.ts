import { Mark } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    featureMark: {
      /**
       * Set a bold mark
       */
      setFeatureMark: () => ReturnType
      /**
       * Toggle a bold mark
       */
      toggleFeatureMark: () => ReturnType
      /**
       * Unset a bold mark
       */
      unsetFeatureMark: () => ReturnType
    }
  }
}

const FeatureMark = Mark.create({
  name: 'featureMark',
  parseHTML() {
    return [
      {
        tag: 'strong',
      },
      {
        tag: 'b',
        getAttrs: node =>
          (node as HTMLElement).style.fontWeight !== 'normal' && null,
      },
      {
        style: 'font-weight',
        getAttrs: value =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
      },
    ]
  },
  addCommands() {
    return {
      setFeatureMark:
        x =>
        ({ commands }) => {
          console.log('x', x)
          return commands.setMark(this.name)
        },
      toggleFeatureMark:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetFeatureMark:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },

  // Your code goes here.
})

export { FeatureMark }
