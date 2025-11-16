import { useState, useEffect, useCallback } from 'react'
import { Creature } from '../types'
import { runSimulationTick } from '../utils/simulation'

interface MockZooResult {
  creatures: Creature[]
  events: string[]
  narration: string
}

export function useZooSimulation() {
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [narration, setNarration] = useState<string>('The digital terrarium awaits... Paste code to populate it with bug creatures.')
  const [isRunning, setIsRunning] = useState(false)
  const [tickCount, setTickCount] = useState(0)
  const [chaosLevel, setChaosLevel] = useState(0)

  // Compute chaos level based on creatures (capped to reflect MAX_CREATURES = 25)
  const computeChaosLevel = useCallback((creatureList: Creature[]): number => {
    const livingCreatures = creatureList.filter(c => c.status !== 'Extinct')
    if (livingCreatures.length === 0) return 0

    const avgAggression = livingCreatures.reduce((sum, c) => sum + c.aggression, 0) / livingCreatures.length
    const criticalCount = livingCreatures.filter(c => c.severity === 'critical').length
    const highCount = livingCreatures.filter(c => c.severity === 'high').length

    // Base chaos from creature count (capped at 25 creatures = 40 points max)
    // This ensures chaos doesn't explode with population caps
    const normalizedCount = Math.min(livingCreatures.length, 25)
    const countChaos = Math.min(40, (normalizedCount / 25) * 40)
    
    // Aggression factor (0-30 points) - more stable with caps
    const aggressionChaos = Math.min(30, avgAggression * 0.3)
    
    // Severity factor (0-30 points) - capped impact
    const severityChaos = Math.min(30, (criticalCount * 10) + (highCount * 4))

    return Math.min(100, Math.round(countChaos + aggressionChaos + severityChaos))
  }, [])

  // Update narration based on chaos level
  const updateNarration = useCallback((chaos: number, creatureCount: number) => {
    const livingCount = creatureCount
    const narrations: string[] = []

    if (chaos < 30) {
      narrations.push(
        `The ecosystem remains calm with ${livingCount} ${livingCount === 1 ? 'creature' : 'creatures'} peacefully coexisting.`,
        `A tranquil moment in the digital terrarium. ${livingCount} ${livingCount === 1 ? 'lifeform' : 'lifeforms'} ${livingCount === 1 ? 'roams' : 'roam'} quietly.`,
        `The codebase is stable. ${livingCount} ${livingCount === 1 ? 'bug' : 'bugs'} ${livingCount === 1 ? 'exists' : 'exist'} in harmony.`
      )
    } else if (chaos < 70) {
      narrations.push(
        `Tensions rise in the ecosystem. ${livingCount} ${livingCount === 1 ? 'creature' : 'creatures'} ${livingCount === 1 ? 'shows' : 'show'} signs of instability.`,
        `The digital terrarium grows unstable. ${livingCount} ${livingCount === 1 ? 'entity' : 'entities'} ${livingCount === 1 ? 'struggles' : 'struggle'} for survival.`,
        `Chaos begins to spread. ${livingCount} ${livingCount === 1 ? 'bug' : 'bugs'} ${livingCount === 1 ? 'is' : 'are'} adapting to the changing environment.`
      )
    } else {
      narrations.push(
        `APOCALYPTIC CHAOS! The ecosystem has reached critical instability. ${livingCount} ${livingCount === 1 ? 'creature' : 'creatures'} ${livingCount === 1 ? 'threatens' : 'threaten'} to consume everything.`,
        `The codebase trembles under apocalyptic pressure. ${livingCount} ${livingCount === 1 ? 'entity' : 'entities'} ${livingCount === 1 ? 'reigns' : 'reign'} supreme in chaos.`,
        `EXTINCTION EVENT IMMINENT! ${livingCount} ${livingCount === 1 ? 'bug' : 'bugs'} ${livingCount === 1 ? 'has' : 'have'} pushed the ecosystem beyond its limits.`
      )
    }

    if (narrations.length > 0) {
      const selected = narrations[Math.floor(Math.random() * narrations.length)]
      setNarration(selected)
    }
  }, [])

  // Initialize from mock result
  const initializeFromMock = useCallback((result: MockZooResult) => {
    setCreatures(result.creatures)
    setEvents(result.events)
    setNarration(result.narration)
    setTickCount(0)
    const chaos = computeChaosLevel(result.creatures)
    setChaosLevel(chaos)
    updateNarration(chaos, result.creatures.length)
  }, [computeChaosLevel, updateNarration])

  // Step once
  const stepOnce = useCallback(() => {
    setCreatures(currentCreatures => {
      const { newCreatures, events: newEvents } = runSimulationTick(currentCreatures)
      
      // Append new events (keep only latest ~50)
      setEvents(currentEvents => {
        const combined = [...currentEvents, ...newEvents.map(e => e.message)]
        return combined.slice(-50)
      })

      // Update chaos level
      const chaos = computeChaosLevel(newCreatures)
      setChaosLevel(chaos)
      
      // Update narration occasionally (every 3 ticks)
      setTickCount(currentTick => {
        const newTick = currentTick + 1
        if (newTick % 3 === 0) {
          updateNarration(chaos, newCreatures.filter(c => c.status !== 'Extinct').length)
        }
        return newTick
      })

      return newCreatures
    })
  }, [computeChaosLevel, updateNarration])

  // Auto-tick effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      stepOnce()
    }, 1200) // ~1.2 seconds per tick

    return () => clearInterval(interval)
  }, [isRunning, stepOnce])

  // Control functions
  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const toggleRunning = useCallback(() => {
    setIsRunning(current => !current)
  }, [])

  const reset = useCallback(() => {
    setCreatures([])
    setEvents([])
    setNarration('The digital terrarium awaits... Paste code to populate it with bug creatures.')
    setTickCount(0)
    setChaosLevel(0)
    setIsRunning(false)
  }, [])

  // Get active bugs - show ALL bugs in Hi buggiesss box
  // They appear as soon as they're detected in the Digital Terrarium
  const activeBugs = creatures

  return {
    creatures,
    activeBugs,
    events,
    narration,
    isRunning,
    tickCount,
    chaosLevel,
    initializeFromMock,
    start,
    pause,
    toggleRunning,
    stepOnce,
    reset
  }
}

