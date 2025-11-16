import AppLayout from './components/layout/AppLayout'
import CodeInputPanel from './components/input/CodeInputPanel'
import EcosystemSummary from './components/zoo/EcosystemSummary'
import CreatureGrid from './components/zoo/CreatureGrid'
import EventLog from './components/events/EventLog'
import NarratorBar from './components/events/NarratorBar'
import { generateMockZooFromCode } from './utils/mockZoo'
import { useZooSimulation } from './hooks/useZooSimulation'

function App() {
  const {
    creatures,
    events,
    narration,
    isRunning,
    tickCount,
    chaosLevel,
    initializeFromMock,
    toggleRunning,
    stepOnce,
    reset
  } = useZooSimulation()

  const handleAnalyzeCode = (code: string) => {
    if (!code || code.trim().length === 0) {
      return
    }

    const result = generateMockZooFromCode(code)
    initializeFromMock(result)
  }

  return (
    <AppLayout
      sidebarProps={{
        isRunning,
        chaosLevel,
        tickCount,
        onToggleRunning: toggleRunning,
        onStep: stepOnce,
        onReset: reset
      }}
    >
      <div className="flex flex-col gap-6 h-full">
        {/* Top Section: Code Input + Ecosystem Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CodeInputPanel onAnalyzeCode={handleAnalyzeCode} />
          </div>
          <div className="lg:col-span-1">
            <EcosystemSummary creatures={creatures} />
          </div>
        </div>

        {/* Middle Section: Creature Grid */}
        <div className="flex-1 min-h-0">
          <CreatureGrid creatures={creatures} />
        </div>

        {/* Bottom Section: Event Log + Narrator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EventLog events={events} />
          </div>
          <div className="lg:col-span-1">
            <NarratorBar narration={narration} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default App

