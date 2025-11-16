import { Creature, Status } from '../types'

export type SimulationEvent = {
  message: string
  timestamp: number
}

// Population control constants
const MAX_CREATURES = 25
const MAX_OFFSPRING_PER_TICK = 2
const MIN_HP_FOR_REPRODUCTION = 40
const CROSS_BREEDING_CHANCE = 0.35 // 35% chance per tick if conditions are met
const MIN_HP_FOR_CROSS_BREEDING = 30 // Lower threshold for cross-breeding to make it more likely

/**
 * Runs a single simulation tick, modifying creatures and generating events.
 */
export function runSimulationTick(creatures: Creature[]): {
  newCreatures: Creature[]
  events: SimulationEvent[]
} {
  const events: SimulationEvent[] = []
  const newCreatures: Creature[] = []
  const timestamp = Date.now()
  let offspringCount = 0

  // Count current non-extinct creatures
  const currentLivingCount = creatures.filter(c => c.status !== 'Extinct').length

  // Process each creature
  for (const creature of creatures) {
    // Skip extinct creatures entirely - they don't participate
    if (creature.status === 'Extinct') {
      continue
    }

    const updatedCreature = { ...creature }

    // HP decay: decrease by 1-2, clamped to 0-100 (much slower decay for longer lifespans)
    const hpDecay = Math.floor(Math.random() * 2) + 1 // 1-2
    updatedCreature.hp = Math.max(0, Math.min(100, updatedCreature.hp - hpDecay))

    // Check for extinction
    if (updatedCreature.hp <= 0) {
      updatedCreature.status = 'Extinct'
      events.push({
        message: `${updatedCreature.name} has gone extinct as its energy faded away.`,
        timestamp
      })
      // Don't add extinct creatures to newCreatures - they're removed
      continue
    }

    // Reproduction: rare and constrained
    const canReproduce = 
      updatedCreature.hp > MIN_HP_FOR_REPRODUCTION &&
      currentLivingCount < MAX_CREATURES &&
      offspringCount < MAX_OFFSPRING_PER_TICK

    if (canReproduce) {
      // Reduced reproduction chance: effectiveChance = min(0.12, reproductionRate * 0.15)
      // Much slower spawning to prevent population explosion
      const effectiveChance = Math.min(0.12, updatedCreature.reproductionRate * 0.15)
      const reproductionRoll = Math.random()

      if (reproductionRoll < effectiveChance) {
        // Spawn offspring with ±5-10 variation (smaller mutations)
        const hpMutation = Math.floor(Math.random() * 6) + 5 // 5-10
        const aggressionMutation = Math.floor(Math.random() * 6) + 5 // 5-10
        const speedMutation = Math.floor(Math.random() * 6) + 5 // 5-10
        
        // Randomly make mutations positive or negative
        const hpSign = Math.random() < 0.5 ? 1 : -1
        const aggressionSign = Math.random() < 0.5 ? 1 : -1
        const speedSign = Math.random() < 0.5 ? 1 : -1

        const offspring: Creature = {
          id: `creature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: updatedCreature.name,
          description: updatedCreature.description,
          severity: updatedCreature.severity,
          breedType: updatedCreature.breedType,
          hp: Math.max(0, Math.min(100, updatedCreature.hp + (hpMutation * hpSign))),
          aggression: Math.max(0, Math.min(100, updatedCreature.aggression + (aggressionMutation * aggressionSign))),
          speed: Math.max(0, Math.min(100, updatedCreature.speed + (speedMutation * speedSign))),
          reproductionRate: updatedCreature.reproductionRate,
          status: 'Newly spawned'
        }

        newCreatures.push(offspring)
        offspringCount++
        events.push({
          message: `${updatedCreature.name} spawned an offspring.`,
          timestamp
        })
      }
    }

    newCreatures.push(updatedCreature)
  }

  // Cross-breeding: attempt hybrid offspring between different species
  const nonExtinctForBreeding = newCreatures.filter(c => c.status !== 'Extinct')
  const canCrossBreed = 
    nonExtinctForBreeding.length >= 2 &&
    offspringCount < MAX_OFFSPRING_PER_TICK &&
    newCreatures.length < MAX_CREATURES &&
    Math.random() < CROSS_BREEDING_CHANCE

  if (canCrossBreed) {
    // Find valid pairs (different species, both healthy enough)
    const validPairs: Array<[Creature, Creature]> = []
    
    for (let i = 0; i < nonExtinctForBreeding.length; i++) {
      for (let j = i + 1; j < nonExtinctForBreeding.length; j++) {
        const parentA = nonExtinctForBreeding[i]
        const parentB = nonExtinctForBreeding[j]
        
        // Both must be healthy enough and different species
        // Use lower threshold for cross-breeding to make it more likely
        if (
          parentA.name !== parentB.name &&
          parentA.hp > MIN_HP_FOR_CROSS_BREEDING &&
          parentB.hp > MIN_HP_FOR_CROSS_BREEDING
        ) {
          validPairs.push([parentA, parentB])
        }
      }
    }

    // If we have valid pairs and haven't exceeded offspring limit, create a hybrid
    if (validPairs.length > 0 && offspringCount < MAX_OFFSPRING_PER_TICK && newCreatures.length < MAX_CREATURES) {
      // Pick a random valid pair
      const pairIndex = Math.floor(Math.random() * validPairs.length)
      const [parentA, parentB] = validPairs[pairIndex]

      // Create hybrid name: first word of parent A + first word of parent B + "(Hybrid)"
      const nameAWords = parentA.name.split(' ')
      const nameBWords = parentB.name.split(' ')
      const hybridName = `${nameAWords[0]} ${nameBWords[0]} (Hybrid)`

      // Combine breedType: "typeA + typeB"
      const hybridBreedType = `${parentA.breedType} + ${parentB.breedType}` as any

      // Severity: take the more severe (critical > high > medium > low)
      const severityOrder: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 }
      const hybridSeverity = severityOrder[parentA.severity] > severityOrder[parentB.severity]
        ? parentA.severity
        : parentB.severity

      // Stats: average of both parents ± small mutation (±5-10)
      const avgHP = (parentA.hp + parentB.hp) / 2
      const avgAggression = (parentA.aggression + parentB.aggression) / 2
      const avgSpeed = (parentA.speed + parentB.speed) / 2
      const avgReproductionRate = Math.max(0.1, Math.min(0.7, (parentA.reproductionRate + parentB.reproductionRate) / 2))

      // Apply mutations
      const hpMutation = Math.floor(Math.random() * 6) + 5 // 5-10
      const aggressionMutation = Math.floor(Math.random() * 6) + 5 // 5-10
      const speedMutation = Math.floor(Math.random() * 6) + 5 // 5-10
      
      const hpSign = Math.random() < 0.5 ? 1 : -1
      const aggressionSign = Math.random() < 0.5 ? 1 : -1
      const speedSign = Math.random() < 0.5 ? 1 : -1

      // Create hybrid description
      const hybridDescription = `Hybrid of ${parentA.name} and ${parentB.name}. A unique fusion combining ${parentA.breedType} and ${parentB.breedType} traits.`

      const hybrid: Creature = {
        id: `creature-hybrid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: hybridName,
        description: hybridDescription,
        severity: hybridSeverity,
        breedType: hybridBreedType,
        hp: Math.max(0, Math.min(100, Math.round(avgHP + (hpMutation * hpSign)))),
        aggression: Math.max(0, Math.min(100, Math.round(avgAggression + (aggressionMutation * aggressionSign)))),
        speed: Math.max(0, Math.min(100, Math.round(avgSpeed + (speedMutation * speedSign)))),
        reproductionRate: avgReproductionRate,
        status: 'Hybrid offspring' as Status
      }

      newCreatures.push(hybrid)
      offspringCount++
      events.push({
        message: `${parentA.name} and ${parentB.name} cross-breed, spawning ${hybridName}.`,
        timestamp
      })
    }
  }

  // Enforce population cap by removing weakest creatures
  if (newCreatures.length > MAX_CREATURES) {
    // Sort by HP (lowest first) to identify weakest
    const sorted = [...newCreatures].sort((a, b) => a.hp - b.hp)
    const toRemove = sorted.slice(0, newCreatures.length - MAX_CREATURES)
    
    // Remove weakest creatures
    const removedIds = new Set(toRemove.map(c => c.id))
    const trimmedCreatures = newCreatures.filter(c => !removedIds.has(c.id))
    
    newCreatures.length = 0
    newCreatures.push(...trimmedCreatures)

    events.push({
      message: 'Overcrowding event: weaker species were pushed out of the ecosystem.',
      timestamp
    })
  }

  // Generate interactions between living creatures (reduced frequency)
  const nonExtinctCreatures = newCreatures.filter(c => c.status !== 'Extinct')
  if (nonExtinctCreatures.length >= 2) {
    // Reduced to 0-1 interactions per tick (50% chance of 1 interaction)
    const numInteractions = Math.random() < 0.5 ? 1 : 0
    const usedPairs = new Set<string>()

    for (let i = 0; i < numInteractions && usedPairs.size < nonExtinctCreatures.length * (nonExtinctCreatures.length - 1) / 2; i++) {
      // Pick two random different creatures
      let idx1 = Math.floor(Math.random() * nonExtinctCreatures.length)
      let idx2 = Math.floor(Math.random() * nonExtinctCreatures.length)
      
      // Ensure they're different
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * nonExtinctCreatures.length)
      }

      const pairKey = [idx1, idx2].sort().join('-')
      if (usedPairs.has(pairKey)) continue
      usedPairs.add(pairKey)

      const creature1 = nonExtinctCreatures[idx1]
      const creature2 = nonExtinctCreatures[idx2]

      // Set status to Clashing or Competing
      const interactionType = Math.random() < 0.5 ? 'Clashing' : 'Competing'
      creature1.status = interactionType as Status
      creature2.status = interactionType as Status

      // Generate interaction event
      const interactionMessages = [
        `${creature1.name} clashes with ${creature2.name} over scarce CPU cycles.`,
        `${creature1.name} competes with ${creature2.name} for memory resources.`,
        `${creature2.name} challenges ${creature1.name}'s dominance in the codebase.`,
        `A territorial dispute erupts between ${creature1.name} and ${creature2.name}.`
      ]
      const message = interactionMessages[Math.floor(Math.random() * interactionMessages.length)]
      events.push({ message, timestamp })
    }
  }

  return {
    newCreatures,
    events
  }
}

