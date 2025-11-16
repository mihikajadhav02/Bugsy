import { motion } from 'framer-motion'

interface EventLogProps {
  events: string[]
}

export default function EventLog({ events }: EventLogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-cyan/30 glow-cyan p-6 h-full overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📜</span>
        <h2 className="text-xl font-bold text-neon-cyan text-glow-cyan">
          Event Log
        </h2>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No events yet...</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel border border-white/10 p-3 rounded-lg text-sm"
            >
              <span className="text-neon-cyan mr-2">▶</span>
              <span className="text-gray-300">{event}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

