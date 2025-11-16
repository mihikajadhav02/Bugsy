import { motion } from 'framer-motion'

interface SidebarProps {
  isRunning?: boolean
  chaosLevel?: number
  tickCount?: number
  onToggleRunning?: () => void
  onStep?: () => void
  onReset?: () => void
  onShowEncyclopedia?: () => void
}

export default function Sidebar({
  isRunning = false,
  chaosLevel = 0,
  tickCount = 0,
  onToggleRunning,
  onStep,
  onReset,
  onShowEncyclopedia
}: SidebarProps) {
  const getChaosLabel = (level: number): string => {
    if (level < 30) return 'Calm'
    if (level < 70) return 'Unstable'
    return 'Apocalyptic'
  }

  const getChaosColor = (level: number): string => {
    if (level < 30) return 'text-neon-emerald'
    if (level < 70) return 'text-neon-cyan'
    return 'text-red-400'
  }

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-64 glass-panel border-r border-neon-emerald/20 p-4 space-y-4"
    >
      <h2 className="text-lg font-bold text-neon-emerald text-glow-emerald mb-4">
        Controls
      </h2>
      
      {/* Start/Pause Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleRunning}
        className="w-full glass-panel border border-white/10 p-3 rounded-lg text-left hover:border-neon-emerald/50 transition-all"
      >
        <span className="mr-2">{isRunning ? '⏸' : '▶'}</span>
        <span className="text-sm">{isRunning ? 'Pause' : 'Start Simulation'}</span>
      </motion.button>

      {/* Advance Tick Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStep}
        className="w-full glass-panel border border-white/10 p-3 rounded-lg text-left hover:border-neon-emerald/50 transition-all"
      >
        <span className="mr-2">⏭</span>
        <span className="text-sm">Advance Tick</span>
      </motion.button>

      {/* Reset Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="w-full glass-panel border border-white/10 p-3 rounded-lg text-left hover:border-neon-emerald/50 transition-all"
      >
        <span className="mr-2">↻</span>
        <span className="text-sm">Reset Zoo</span>
      </motion.button>

      {/* Get to Know the Bugs Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onShowEncyclopedia}
        className="w-full glass-panel border border-neon-fuchsia/50 p-3 rounded-lg text-left hover:border-neon-fuchsia transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg flex-shrink-0">📚</span>
          <span className="text-xs text-neon-fuchsia font-medium leading-tight">Bug Encyclopedia</span>
        </div>
      </motion.button>

      {/* Chaos Level Display */}
      <div className="mt-8 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-400">Chaos Level</h3>
          <span className={`text-sm font-bold ${getChaosColor(chaosLevel)}`}>
            {getChaosLabel(chaosLevel)}
          </span>
        </div>
        <div className="glass-panel border border-white/10 p-2 rounded mb-3">
          <div className="h-2 bg-dark-panel/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                chaosLevel < 30
                  ? 'bg-neon-emerald'
                  : chaosLevel < 70
                  ? 'bg-neon-cyan'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min(100, chaosLevel)}%`,
                boxShadow: `0 0 10px ${
                  chaosLevel < 30
                    ? 'rgba(0, 255, 136, 0.5)'
                    : chaosLevel < 70
                    ? 'rgba(0, 255, 255, 0.5)'
                    : 'rgba(255, 0, 0, 0.5)'
                }`
              }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          <div>Ticks: {tickCount}</div>
        </div>
      </div>
    </motion.aside>
  )
}

