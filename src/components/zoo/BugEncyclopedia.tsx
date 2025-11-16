import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Creature, Severity } from '../../types'
import BugCard from './BugCard'

interface BugEncyclopediaProps {
  isOpen: boolean
  onClose: () => void
}

// Mapping of bug slugs to display names and labels
const bugInfo: Record<string, { name: string; label: string; severity: Severity; breedType: string }> = {
  'glow-moth': { name: 'Glow Moth', label: '💧 Memory Leak', severity: 'high', breedType: 'memory' },
  'tangled-worm': { name: 'Tangled Worm', label: '🍝 Spaghetti Code', severity: 'medium', breedType: 'architecture' },
  'void-beetle': { name: 'Void Beetle', label: '⛔ Null Pointer', severity: 'high', breedType: 'safety' },
  'offset-ant': { name: 'Offset Ant', label: '➕1 Off-by-one', severity: 'medium', breedType: 'indexing' },
  'flash-mantis': { name: 'Flash Mantis', label: '⚡ Race Condition', severity: 'critical', breedType: 'concurrency' },
  'ring-cicada': { name: 'Ring Cicada', label: '∞ Infinite Loop', severity: 'critical', breedType: 'control_flow' },
  'rune-spider': { name: 'Rune Spider', label: '{} Syntax Error', severity: 'low', breedType: 'syntax' },
  'blink-firefly': { name: 'Blink Firefly', label: '📣 Log Spam', severity: 'low', breedType: 'logging' }
}

// Helper function to convert filename to hybrid bug entry
function createHybridBug(filename: string): Omit<Creature, 'id' | 'hp' | 'aggression' | 'speed' | 'reproductionRate' | 'status'> | null {
  const parts = filename.split('-')
  if (parts.length < 4) return null // Need at least 2 bugs (each has 2 parts)
  
  // Find where the first bug ends and second begins
  // Bugs are: blink-firefly, flash-mantis, glow-moth, offset-ant, ring-cicada, rune-spider, tangled-worm, void-beetle
  const bugSlugs = ['blink-firefly', 'flash-mantis', 'glow-moth', 'offset-ant', 'ring-cicada', 'rune-spider', 'tangled-worm', 'void-beetle']
  
  let parent1Slug = ''
  let parent2Slug = ''
  let remaining = filename
  
  // Try to find first bug
  for (const slug of bugSlugs) {
    if (remaining.startsWith(slug)) {
      parent1Slug = slug
      remaining = remaining.substring(slug.length + 1) // +1 for the hyphen
      break
    }
  }
  
  // Second bug is the remaining part
  parent2Slug = remaining
  
  const parent1 = bugInfo[parent1Slug]
  const parent2 = bugInfo[parent2Slug]
  
  if (!parent1 || !parent2) return null
  
  // Determine severity (take the more severe)
  const severityOrder: Record<Severity, number> = { low: 1, medium: 2, high: 3, critical: 4 }
  const hybridSeverity = severityOrder[parent1.severity] > severityOrder[parent2.severity] 
    ? parent1.severity 
    : parent2.severity
  
  return {
    name: `${parent1.name} × ${parent2.name}`,
    bugLabel: `${parent1.label} × ${parent2.label}`,
    bugCategory: `${parent1Slug}_${parent2Slug}`,
    description: `A hybrid fusion of ${parent1.name} and ${parent2.name}. Combines ${parent1.label} and ${parent2.label} into a unique chaotic entity.`,
    severity: hybridSeverity,
    breedType: `${parent1.breedType} + ${parent2.breedType}` as any,
    imageUrl: `/hybrid/${filename}.png`
  }
}

// All hybrid filenames
const hybridFilenames = [
  'blink-firefly-flash-mantis', 'blink-firefly-glow-moth', 'blink-firefly-ring-cicada', 'blink-firefly-rune-spider', 'blink-firefly-tangled-worm',
  'flash-mantis-blink-firefly', 'flash-mantis-glow-moth', 'flash-mantis-offset-ant', 'flash-mantis-ring-cicada', 'flash-mantis-rune-spider', 'flash-mantis-tangled-worm', 'flash-mantis-void-beetle',
  'glow-moth-blink-firefly', 'glow-moth-flash-mantis', 'glow-moth-offset-ant', 'glow-moth-ring-cicada', 'glow-moth-rune-spider', 'glow-moth-tangled-worm', 'glow-moth-void-beetle',
  'offset-ant-flash-mantis', 'offset-ant-glow-moth', 'offset-ant-ring-cicada', 'offset-ant-rune-spider', 'offset-ant-tangled-worm', 'offset-ant-void-beetle',
  'ring-cicada-blink-firefly', 'ring-cicada-flash-mantis', 'ring-cicada-glow-moth', 'ring-cicada-offset-ant', 'ring-cicada-rune-spider', 'ring-cicada-tangled-worm', 'ring-cicada-void-beetle',
  'rune-spider-blink-firefly', 'rune-spider-flash-mantis', 'rune-spider-offset-ant', 'rune-spider-ring-cicada', 'rune-spider-tangled-worm', 'rune-spider-void-beetle',
  'tangled-worm-blink-firefly', 'tangled-worm-flash-mantis', 'tangled-worm-offset-ant', 'tangled-worm-ring-cicada', 'tangled-worm-rune-spider', 'tangled-worm-void-beetle',
  'void-beetle-flash-mantis', 'void-beetle-offset-ant', 'void-beetle-ring-cicada', 'void-beetle-rune-spider', 'void-beetle-tangled-worm'
]

// Generate hybrid bugs
const hybridBugs = hybridFilenames
  .map(filename => createHybridBug(filename))
  .filter((bug): bug is NonNullable<typeof bug> => bug !== null)

// All bug archetypes with sample data for display
const allBugTypes: Omit<Creature, 'id' | 'hp' | 'aggression' | 'speed' | 'reproductionRate' | 'status'>[] = [
  {
    name: "Glow Moth",
    bugLabel: "💧 Memory Leak",
    bugCategory: "memory_leak",
    description: "A luminous moth that drips stored data wherever it goes, slowly flooding the heap with glowing residue.",
    severity: "high",
    breedType: "memory",
    imageUrl: "/bugs/glow-moth.png"
  },
  {
    name: "Tangled Worm",
    bugLabel: "🍝 Spaghetti Code",
    bugCategory: "spaghetti_code",
    description: "A rainbow worm made of twisted logic strands, impossible to straighten without breaking something else.",
    severity: "medium",
    breedType: "architecture",
    imageUrl: "/bugs/tangled-worm.png"
  },
  {
    name: "Void Beetle",
    bugLabel: "⛔ Null Pointer",
    bugCategory: "null_pointer",
    description: "A hollow-shelled beetle that represents missing values and unchecked assumptions, crashing anything that touches its void.",
    severity: "high",
    breedType: "safety",
    imageUrl: "/bugs/void-beetle.png"
  },
  {
    name: "Offset Ant",
    bugLabel: "➕1 Off-by-one",
    bugCategory: "off_by_one",
    description: "An over-eager ant that always overshoots or undershoots the target slot by one tiny step.",
    severity: "medium",
    breedType: "indexing",
    imageUrl: "/bugs/offset-ant.png"
  },
  {
    name: "Flash Mantis",
    bugLabel: "⚡ Race Condition",
    bugCategory: "race_condition",
    description: "A hyper-fast mantis that acts before the rest of the system is ready, causing unpredictable outcomes.",
    severity: "critical",
    breedType: "concurrency",
    imageUrl: "/bugs/flash-mantis.png"
  },
  {
    name: "Ring Cicada",
    bugLabel: "∞ Infinite Loop",
    bugCategory: "infinite_loop",
    description: "A cicada that sings the same cycle forever, looping in a glowing ring without ever reaching a return.",
    severity: "critical",
    breedType: "control_flow",
    imageUrl: "/bugs/ring-cicada.png"
  },
  {
    name: "Rune Spider",
    bugLabel: "{} Syntax Error",
    bugCategory: "syntax_error",
    description: "A spider that spins webs of broken symbols; one wrong rune and the whole structure collapses.",
    severity: "low",
    breedType: "syntax",
    imageUrl: "/bugs/rune-spider.png"
  },
  {
    name: "Blink Firefly",
    bugLabel: "📣 Log Spam",
    bugCategory: "log_spam",
    description: "An overexcited firefly that won't stop blinking, drowning the night (and your console) in noise.",
    severity: "low",
    breedType: "logging",
    imageUrl: "/bugs/blink-firefly.png"
  },
  // Add all hybrid bugs
  ...hybridBugs
]

export default function BugEncyclopedia({ isOpen, onClose }: BugEncyclopediaProps) {
  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const baseBugCount = allBugTypes.length - hybridBugs.length
  const totalBugCount = allBugTypes.length

  // Convert to full Creature objects with sample stats for display
  const bugCreatures: Creature[] = allBugTypes.map((bug, index) => ({
    ...bug,
    id: `encyclopedia-${bug.bugCategory}-${index}`,
    hp: 80,
    aggression: 50,
    speed: 50,
    reproductionRate: 0.5,
    status: 'Roaming' as const
  }))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Panel - Full Screen Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-2 md:inset-4 glass-panel border-2 border-neon-fuchsia/50 glow-fuchsia z-50 overflow-hidden flex flex-col shadow-2xl rounded-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📚</span>
                <div>
                  <h2 className="text-3xl font-bold text-neon-fuchsia text-glow-fuchsia">
                    Get to Know the Bugs
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {totalBugCount} bug creatures • {baseBugCount} base types • {hybridBugs.length} hybrids
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ×
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollBehavior: 'smooth' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[95%] mx-auto">
                {bugCreatures.map((bug, index) => (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BugCard creature={bug} />
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-white/10 text-center max-w-7xl mx-auto">
                <p className="text-sm text-gray-400">
                  These bugs appear when you analyze code with matching patterns
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

