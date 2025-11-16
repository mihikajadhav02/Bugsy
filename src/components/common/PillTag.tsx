import { Severity } from '../../types'

interface PillTagProps {
  label: string
  variant: 'primary' | 'secondary' | Severity
}

const variantClasses = {
  primary: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
  secondary: 'bg-neon-emerald/20 text-neon-emerald border-neon-emerald/50',
  low: 'bg-neon-emerald/20 text-neon-emerald border-neon-emerald/50',
  medium: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
  high: 'bg-neon-fuchsia/20 text-neon-fuchsia border-neon-fuchsia/50',
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
}

export default function PillTag({ label, variant }: PillTagProps) {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}

