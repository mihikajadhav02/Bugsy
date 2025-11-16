import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border-b border-neon-cyan/30 glow-cyan p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-fuchsia"
          />
          <div>
            <h1 className="text-2xl font-bold text-glow-cyan text-neon-cyan">
              Emergent Bug Zoo
            </h1>
            <p className="text-sm text-gray-400">Ctrl+Alt+Delusion</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 glass-panel border border-neon-fuchsia/30 glow-fuchsia rounded-lg"
        >
          <span className="text-sm font-semibold text-neon-fuchsia">Hackathon Mode</span>
        </motion.div>
      </div>
    </motion.header>
  )
}

