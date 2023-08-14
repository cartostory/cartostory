import { ActionProvider, StoryProvider } from './providers/story-provider'
import { Map, Shadow, Story } from './components'
import { AppBar } from '../../home'

function Write() {
  return (
    <StoryProvider>
      <ActionProvider>
        <AppBar />
        <div className="w-full flex pt-[80px]">
          <div className="w-1/2 bg-gray-200 relative">
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
