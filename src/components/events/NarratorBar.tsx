import { motion } from 'framer-motion'

interface NarratorBarProps {
  narration: string
}

export default function NarratorBar({ narration }: NarratorBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-fuchsia/30 glow-fuchsia p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎭</span>
        <h2 className="text-xl font-bold text-neon-fuchsia text-glow-fuchsia">
          Narrator
        </h2>
      </div>
      
      <motion.p
        key={narration}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-300 italic leading-relaxed"
      >
        "{narration}"
      </motion.p>
    </motion.div>
  )
}

