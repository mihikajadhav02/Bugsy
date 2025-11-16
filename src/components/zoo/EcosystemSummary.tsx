import { motion } from 'framer-motion'
import { Creature } from '../../types'

interface EcosystemSummaryProps {
  creatures: Creature[]
}

const colorClasses = {
  cyan: 'text-neon-cyan text-glow-cyan',
  fuchsia: 'text-neon-fuchsia text-glow-fuchsia',
  emerald: 'text-neon-emerald text-glow-emerald',
}

export default function EcosystemSummary({ creatures }: EcosystemSummaryProps) {
  const totalHP = creatures.reduce((sum, c) => sum + c.hp, 0)
  const avgAggression = creatures.reduce((sum, c) => sum + c.aggression, 0) / creatures.length || 0
  const activeThreats = creatures.filter(c => c.severity === 'critical' || c.severity === 'high').length

  const stats = [
    { label: 'Total Creatures', value: creatures.length, color: 'cyan' as const },
    { label: 'Total HP', value: totalHP, color: 'fuchsia' as const },
    { label: 'Avg Aggression', value: Math.round(avgAggression), color: 'emerald' as const },
    { label: 'Active Threats', value: activeThreats, color: 'cyan' as const },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-fuchsia/30 glow-fuchsia p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-bold text-neon-fuchsia text-glow-fuchsia">
          Ecosystem Summary
        </h2>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel border border-white/10 p-3 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <span className={`text-lg font-bold ${colorClasses[stat.color]}`}>
                {stat.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

