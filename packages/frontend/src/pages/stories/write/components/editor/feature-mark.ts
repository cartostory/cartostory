import { Mark, mergeAttributes } from '@tiptap/core'
import type { EntityMarker } from '../../../../../lib/editor'

export interface FeatureOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: {
    'data-feature-id'?: string
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    test: {
      /**
       * Set a feature mark
       */
      setMarker: (layer: EntityMarker) => ReturnType
      /**
       * Toggle a feature mark
       */
      toggleMarker: () => ReturnType
      /**
       * Unset a feature mark
       */
      unsetMarker: () => ReturnType
    }
  }
}

export const FeatureMark = Mark.create<FeatureOptions>({
  name: 'feature',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      'data-feature-id': {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a',
      },
    ]
  },

  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: FeatureOptions['HTMLAttributes']
  }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setMarker:
        layer =>
        ({ commands }) => {
          const attributes = {
            'data-feature-id': layer.options.id,
          }
          return commands.setMark(this.name, attributes)
        },
      toggleMarker:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetMarker:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
