import { motion } from 'framer-motion'
import { Creature } from '../../types'
import { useEffect, useState, useRef } from 'react'

interface HiBuggiesssProps {
  activeBugs: Creature[]
}

// Helper function to get fallback image URLs for hybrids (same as BugCard)
function getFallbackImageUrls(creatureName: string): string[] {
  if (!creatureName.includes('×')) {
    return []
  }
  
  const parentNames = creatureName.split('×').map(name => name.trim())
  return parentNames.map(name => {
    const bugPath = name.toLowerCase().replace(/\s+/g, '-')
    return `/bugs/${bugPath}.png`
  })
}

// Helper function to get image URL with fallback support
function getImageUrl(creature: Creature): string {
  // Use the creature's imageUrl if available, otherwise generate from name
  if (creature.imageUrl) {
    return creature.imageUrl
  }
  
  // Fallback: generate URL from name
  if (creature.name.includes('×')) {
    const parts = creature.name.split('×').map(part => 
      part.trim().toLowerCase().replace(/\s+/g, '-')
    )
    return `/hybrid/${parts.join('-')}.png`
  }
  
  const bugPath = creature.name.toLowerCase().replace(/\s+/g, '-')
  return `/bugs/${bugPath}.png`
}

interface BugState {
  x: number
  y: number
  vx: number // velocity x
  vy: number // velocity y
}

const CONTAINER_WIDTH = 800
const CONTAINER_HEIGHT = 500
const BUG_SIZE = 192
const SPEED_MIN = 0.5
const SPEED_MAX = 2.5

export default function HiBuggiesss({ activeBugs }: HiBuggiesssProps) {
  const [bugStates, setBugStates] = useState<Map<string, BugState>>(new Map())
  const [imageUrls, setImageUrls] = useState<Map<string, { current: string; fallbacks: string[]; fallbackIndex: number }>>(new Map())
  const animationFrameRef = useRef<number>()

  // Initialize bug states with random positions and velocities
  useEffect(() => {
    setBugStates(prev => {
      const newStates = new Map(prev)
      
      activeBugs.forEach(bug => {
        // Initialize if bug doesn't exist, otherwise keep existing state
        if (!newStates.has(bug.id)) {
          const angle = Math.random() * Math.PI * 2 // Random direction
          const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
          
          newStates.set(bug.id, {
            x: Math.random() * Math.max(0, CONTAINER_WIDTH - BUG_SIZE),
            y: Math.random() * Math.max(0, CONTAINER_HEIGHT - BUG_SIZE),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
          })
        }
      })
      
      // Remove bugs that are no longer active
      const activeBugIds = new Set(activeBugs.map(b => b.id))
      for (const [id] of newStates) {
        if (!activeBugIds.has(id)) {
          newStates.delete(id)
        }
      }
      
      return newStates
    })
    
    // Initialize image URLs with fallbacks
    setImageUrls(prev => {
      const newImageUrls = new Map(prev)
      activeBugs.forEach(bug => {
        if (!newImageUrls.has(bug.id)) {
          const fallbacks = getFallbackImageUrls(bug.name)
          newImageUrls.set(bug.id, {
            current: getImageUrl(bug),
            fallbacks,
            fallbackIndex: 0
          })
        }
      })
      return newImageUrls
    })
  }, [activeBugs])

  // Continuous animation loop with wall bouncing
  useEffect(() => {
    if (activeBugs.length === 0) return

    const animate = () => {
      setBugStates(prev => {
        const newStates = new Map(prev)
        
        activeBugs.forEach(bug => {
          const state = newStates.get(bug.id)
          if (!state) return
          
          let { x, y, vx, vy } = state
          
          // Update position
          x += vx
          y += vy
          
          // Bounce off walls
          if (x <= 0 || x >= CONTAINER_WIDTH - BUG_SIZE) {
            vx = -vx // Reverse x velocity
            x = Math.max(0, Math.min(CONTAINER_WIDTH - BUG_SIZE, x)) // Clamp position
          }
          
          if (y <= 0 || y >= CONTAINER_HEIGHT - BUG_SIZE) {
            vy = -vy // Reverse y velocity
            y = Math.max(0, Math.min(CONTAINER_HEIGHT - BUG_SIZE, y)) // Clamp position
          }
          
          newStates.set(bug.id, { x, y, vx, vy })
        })
        
        return newStates
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeBugs])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border border-neon-fuchsia/30 glow-fuchsia p-6 overflow-hidden relative"
      style={{ height: '600px' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👋</span>
        <h2 className="text-xl font-bold text-neon-fuchsia text-glow-fuchsia">
          Hi buggiesss
        </h2>
      </div>
      
      {activeBugs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No active bugs...</p>
          <p className="text-sm">Bugs will appear here when they multiply or die!</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden" style={{ height: '500px' }}>
          {activeBugs.map((bug) => {
            const state = bugStates.get(bug.id)
            if (!state) return null
            
            const imageData = imageUrls.get(bug.id) || { current: '', fallbacks: [], fallbackIndex: 0 }
            const currentImageUrl = imageData.current
            
            const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
              if (imageData.fallbacks.length > 0 && imageData.fallbackIndex < imageData.fallbacks.length) {
                const nextUrl = imageData.fallbacks[imageData.fallbackIndex]
                setImageUrls(prev => {
                  const newUrls = new Map(prev)
                  const bugData = newUrls.get(bug.id) || { current: '', fallbacks: [], fallbackIndex: 0 }
                  newUrls.set(bug.id, {
                    ...bugData,
                    current: nextUrl,
                    fallbackIndex: bugData.fallbackIndex + 1
                  })
                  return newUrls
                })
                e.currentTarget.src = nextUrl
              } else {
                e.currentTarget.style.display = 'none'
              }
            }
            
            return (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: state.x,
                  y: state.y
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 }
                }}
                className="absolute w-48 h-48 pointer-events-none"
                style={{
                  willChange: 'transform'
                }}
              >
                {currentImageUrl && (
                  <img
                    key={currentImageUrl}
                    src={currentImageUrl}
                    alt={bug.name}
                    className="w-48 h-48 object-contain drop-shadow-lg"
                    onError={handleImageError}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255, 0, 255, 0.5))'
                    }}
                  />
                )}
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-fuchsia border-2 border-slate-900 animate-pulse" />
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

