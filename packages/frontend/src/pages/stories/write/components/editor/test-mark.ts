import { Mark, mergeAttributes } from '@tiptap/core'

export interface TestOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    test: {
      /**
       * Set a feature mark
       */
      setTest: (layer: L.Marker) => ReturnType
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
  name: 'test',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      'data-lat': {
        default: null,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: element => element.getAttribute('data-lat'),
        // … and customize the HTML rendering.
        renderHTML: attributes => {
          return {
            'data-lat': attributes['data-lat'],
          }
        },
      },
      'data-lng': {
        default: null,
        parseHTML: element => element.getAttribute('data-lng'),
        renderHTML: attributes => {
          return {
            'data-lng': attributes['data-lng'],
          }
        },
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

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setTest:
        layer =>
        ({ commands }) => {
          const { lat, lng } = layer.getLatLng()
          const attributes = {
            'data-lat': lat,
            'data-lng': lng,
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
