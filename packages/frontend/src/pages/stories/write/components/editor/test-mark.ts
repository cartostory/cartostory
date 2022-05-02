import { Mark, mergeAttributes } from '@tiptap/core'

export interface TestOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: {
    'data-lat'?: string
    'data-lng'?: string
    'data-feature-id'?: string
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    test: {
      /**
       * Set a feature mark
       */
      setTest: (layer: L.Marker, handler: () => void) => ReturnType
      /**
       * Toggle a feature mark
       */
      toggleTest: () => ReturnType
      /**
       * Unset a feature mark
       */
      unsetTest: () => ReturnType
    }
  }
}

export const TestMark = Mark.create<TestOptions>({
  name: 'feature',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  // data-lat + data-lng are duplicate to data-feature-id
  // leave it as is until I find what works better
  addAttributes() {
    return {
      'data-lat': {
        default: null,
      },
      'data-lng': {
        default: null,
      },
      'data-feature-id': {
        default: null,
      },
      onclick: {
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
    HTMLAttributes: TestOptions['HTMLAttributes']
  }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addProseMirrorPlugins() {
    return [
      {
        getState() {},
        spec: {},
        props: {
          handleClickOn: () => {
            const attrs = this.editor.getAttributes('feature')
            const featureId = attrs['data-feature-id']
            const lat = attrs['data-lat']
            const lng = attrs['data-lng']
            attrs.onclick?.({ lat, lng })
            return false
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTest:
        (layer, handler) =>
        ({ commands }) => {
          console.log('layer', layer, 'handler', handler)
          const { lat, lng } = layer.getLatLng()
          const { id } = layer.options
          const attributes = {
            'data-lat': lat.toFixed(6),
            'data-lng': lng.toFixed(6),
            'data-feature-id': id,
            onclick: handler,
          }
          return commands.setMark(this.name, attributes)
        },
      toggleTest:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetTest:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
