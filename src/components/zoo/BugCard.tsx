import { motion } from 'framer-motion'
import { useState } from 'react'
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

// Helper function to get fallback image URLs for hybrids
function getFallbackImageUrls(creatureName: string): string[] {
  if (!creatureName.includes('×')) {
    return []
  }
  
  // Extract parent names: "Glow Moth × Flash Mantis" -> ["Glow Moth", "Flash Mantis"]
  const parentNames = creatureName.split('×').map(name => name.trim())
  
  // Convert to image paths: "Glow Moth" -> "/bugs/glow-moth.png"
  return parentNames.map(name => {
    const bugPath = name.toLowerCase().replace(/\s+/g, '-')
    return `/bugs/${bugPath}.png`
  })
}

export default function BugCard({ creature }: BugCardProps) {
  const colors = severityColors[creature.severity]
  const fallbackUrls = creature.name.includes('×') ? getFallbackImageUrls(creature.name) : []
  const [currentImageUrl, setCurrentImageUrl] = useState(creature.imageUrl || '')
  const [fallbackIndex, setFallbackIndex] = useState(0)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // If hybrid and fallback URLs exist, try fallback
    if (fallbackUrls.length > 0 && fallbackIndex < fallbackUrls.length) {
      const nextUrl = fallbackUrls[fallbackIndex]
      setCurrentImageUrl(nextUrl)
      setFallbackIndex(fallbackIndex + 1)
    } else {
      // Hide image if no more fallbacks available
      e.currentTarget.style.display = 'none'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`glass-panel border ${colors.border} ${colors.glow} p-4 rounded-lg cursor-pointer transition-all`}
    >
      {/* Creature Image */}
      {currentImageUrl && (
        <div className="mb-3 flex justify-center">
          <img 
            key={currentImageUrl}
            src={currentImageUrl} 
            alt={creature.name}
            className="w-24 h-24 object-contain"
            onError={handleImageError}
          />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex flex-col gap-1 mb-2">
            <h3 className={`text-lg font-bold ${colors.text}`}>
              {creature.name}
            </h3>
            <div className="inline-flex items-center rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
              {creature.bugLabel}
            </div>
          </div>
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

