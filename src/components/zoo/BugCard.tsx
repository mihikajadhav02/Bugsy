import { motion } from 'framer-motion'
import { Creature, Severity } from '../../types'
import StatBar from '../common/StatBar'
import PillTag from '../common/PillTag'

interface BugCardProps {
  creature: Creature
}

const severityColors: Record<Severity, { border: string; glow: string; text: string }> = {
  low: { border: 'border-neon-emerald/50', glow: 'glow-emerald', text: 'text-neon-emerald' },
  medium: { border: 'border-neon-cyan/50', glow: 'glow-cyan', text: 'text-neon-cyan' },
  high: { border: 'border-neon-fuchsia/50', glow: 'glow-fuchsia', text: 'text-neon-fuchsia' },
  critical: { border: 'border-red-500/50', glow: 'shadow-[0_0_20px_rgba(255,0,0,0.5)]', text: 'text-red-400' },
}

export default function BugCard({ creature }: BugCardProps) {
  const colors = severityColors[creature.severity]

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`glass-panel border ${colors.border} ${colors.glow} p-4 rounded-lg cursor-pointer transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${colors.text} mb-1`}>
            {creature.name}
          </h3>
          <PillTag label={creature.breedType} variant="secondary" />
        </div>
        <PillTag label={creature.severity} variant={creature.severity} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {creature.description}
      </p>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <StatBar label="HP" value={creature.hp} max={150} color="emerald" />
        <StatBar label="Aggression" value={creature.aggression} max={100} color="fuchsia" />
        <StatBar label="Speed" value={creature.speed} max={100} color="cyan" />
        <StatBar label="Reproduction" value={Math.round(creature.reproductionRate * 100)} max={100} color="emerald" />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs text-gray-500">Status:</span>
        <span className={`text-xs font-semibold ${colors.text}`}>
          {creature.status}
        </span>
      </div>
    </motion.div>
  )
}

