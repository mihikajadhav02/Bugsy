import { motion } from 'framer-motion'
import { Creature } from '../../types'
import BugCard from './BugCard'

interface CreatureGridProps {
  creatures: Creature[]
}

export default function CreatureGrid({ creatures }: CreatureGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-emerald/30 glow-emerald p-6 h-full overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🦎</span>
        <h2 className="text-xl font-bold text-neon-emerald text-glow-emerald">
          Digital Terrarium
        </h2>
      </div>
      
      {creatures.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No creatures yet...</p>
          <p className="text-sm">Extract bugs from code to populate the terrarium!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creatures.map((creature, index) => (
            <motion.div
              key={creature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BugCard creature={creature} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

