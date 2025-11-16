import { motion } from 'framer-motion'

interface StatBarProps {
  label: string
  value: number
  max: number
  color: 'cyan' | 'fuchsia' | 'emerald'
}

const colorClasses = {
  cyan: 'bg-neon-cyan',
  fuchsia: 'bg-neon-fuchsia',
  emerald: 'bg-neon-emerald',
}

const textColorClasses = {
  cyan: 'text-neon-cyan',
  fuchsia: 'text-neon-fuchsia',
  emerald: 'text-neon-emerald',
}

export default function StatBar({ label, value, max, color }: StatBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-2 bg-dark-panel/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`h-full ${colorClasses[color]} rounded-full`}
          style={{
            boxShadow: `0 0 10px ${color === 'cyan' ? 'rgba(0, 255, 255, 0.5)' : color === 'fuchsia' ? 'rgba(255, 0, 255, 0.5)' : 'rgba(0, 255, 136, 0.5)'}`
          }}
        />
      </div>
      <span className={`text-xs font-semibold w-12 text-right ${textColorClasses[color]}`}>
        {value}
      </span>
    </div>
  )
}

