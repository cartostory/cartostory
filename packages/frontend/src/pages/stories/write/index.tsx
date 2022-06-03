import { ActionProvider, StoryProvider } from './providers/story-provider'
import { Map, Shadow, Story } from './components'

function Write() {
  return (
    <StoryProvider>
      <ActionProvider>
        <div className="w-full flex">
          <div className="w-1/2 bg-gray-200">
            <Map />
            <Shadow />
          </div>
          <div className="w-1/2 p-5 px-10 flex flex-col h-[100vh]">
            <Story />
          </div>
        </div>
      </ActionProvider>
    </StoryProvider>
  )
}

export { Write }
