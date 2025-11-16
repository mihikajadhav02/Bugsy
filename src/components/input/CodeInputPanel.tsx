import { motion } from 'framer-motion'
import { useState } from 'react'

interface CodeInputPanelProps {
  onAnalyzeCode: (code: string) => void
}

export default function CodeInputPanel({ onAnalyzeCode }: CodeInputPanelProps) {
  const [code, setCode] = useState('')

  const handleAnalyze = () => {
    onAnalyzeCode(code)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-cyan/30 glow-cyan p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💻</span>
        <h2 className="text-xl font-bold text-neon-cyan text-glow-cyan">
          Code Input
        </h2>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your buggy code here... The AI will extract bugs and transform them into creatures!"
        className="w-full h-48 bg-dark-panel/60 border border-white/10 rounded-lg p-4 text-sm font-mono text-gray-300 placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all resize-none"
      />
      
      <motion.button
        onClick={handleAnalyze}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full glass-panel border border-neon-cyan/50 glow-cyan py-3 rounded-lg font-semibold text-neon-cyan hover:bg-neon-cyan/10 transition-all"
      >
        Extract Bugs →
      </motion.button>
    </motion.div>
  )
}

