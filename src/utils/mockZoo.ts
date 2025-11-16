import { Creature, Severity, BreedType, Status } from '../types'
import { hashStringToSeed, createSeededRng, SeededRng } from './seededRandom'

export interface MockZooResult {
  creatures: Creature[]
  events: string[]
  narration: string
}

interface BugArchetype {
  name: string
  description: string
  severity: Severity
  breedType: BreedType
}

const bugArchetypes: BugArchetype[] = [
  {
    name: "NullPointer Sloth",
    description: "Born from dereferencing undefined values. Moves slowly but causes crashes.",
    severity: "high",
    breedType: "memory"
  },
  {
    name: "RaceCondition Raptor",
    description: "Fast, unpredictable, and dangerous. Thrives in concurrent chaos.",
    severity: "critical",
    breedType: "concurrency"
  },
  {
    name: "OffByOne Ape",
    description: "Mischievous indexer that always misses by one. Loves array boundaries.",
    severity: "medium",
    breedType: "logic"
  },
  {
    name: "Leaky Kraken",
    description: "Tentacles of memory leaks spreading through the codebase.",
    severity: "high",
    breedType: "memory"
  },
  {
    name: "Spaghetti Hydra",
    description: "Multi-headed monster of tangled code. Cuts one head, two grow back.",
    severity: "medium",
    breedType: "logic"
  },
  {
    name: "Syntax Serpent",
    description: "Slithers through code leaving parsing errors in its wake.",
    severity: "low",
    breedType: "syntax"
  },
  {
    name: "Performance Snail",
    description: "Slow and methodical, leaving O(n²) trails everywhere.",
    severity: "medium",
    breedType: "performance"
  },
  {
    name: "Infinite Loop Leviathan",
    description: "Massive creature that never stops. Consumes all CPU cycles.",
    severity: "critical",
    breedType: "performance"
  }
]

const statuses: Status[] = ["Roaming", "Hunting", "Sleeping", "Reproducing", "Evolving"]

function generateCreature(archetype: BugArchetype, index: number, seed: number, rng: SeededRng): Creature {
  // Use seed + index to create unique deterministic IDs
  const idSeed = seed + index * 1000
  const idRng = createSeededRng(idSeed)
  const idNumber = Math.floor(idRng.rand(1000000, 10000000))
  
  return {
    id: `creature-${idNumber}-${index}`,
    name: archetype.name,
    description: archetype.description,
    severity: archetype.severity,
    breedType: archetype.breedType,
    hp: Math.floor(rng.rand(40, 121)), // [40, 120] inclusive
    aggression: Math.floor(rng.rand(10, 96)), // [10, 95] inclusive
    speed: Math.floor(rng.rand(5, 91)), // [5, 90] inclusive
    reproductionRate: rng.rand(0.1, 0.71), // [0.1, 0.7] approximately
    status: rng.pick(statuses)
  }
}

function generateEvents(creatures: Creature[], rng: SeededRng): string[] {
  if (creatures.length < 2) {
    return [
      "The ecosystem is too calm... too quiet.",
      "A single creature wanders alone in the digital void."
    ]
  }

  const events: string[] = []
  
  // Deterministically pick two creatures
  const indices = [0, 1]
  if (creatures.length > 2) {
    indices[1] = Math.floor(rng.rand(1, creatures.length))
  }
  const creature1 = creatures[indices[0]]
  const creature2 = creatures[indices[1]]

  const interactions = [
    `${creature1.name} eyes ${creature2.name} warily.`,
    `${creature2.name} circles ${creature1.name} with ${creature2.severity === 'critical' ? 'malicious' : 'curious'} intent.`,
    `${creature1.name} ${creature1.status.toLowerCase()}s near ${creature2.name}.`,
    `${creature2.name} detects ${creature1.name}'s ${creature1.breedType} signature.`,
    `A tense standoff between ${creature1.name} and ${creature2.name}.`,
    `${creature1.name} pretends nothing is wrong while ${creature2.name} watches.`,
    `The ${creature1.breedType} energy of ${creature1.name} clashes with ${creature2.name}'s ${creature2.breedType} aura.`
  ]

  const numEvents = Math.floor(rng.rand(2, 4)) // [2, 4) -> 2 or 3
  // Deterministically select events without duplicates
  const selectedIndices = new Set<number>()
  while (events.length < numEvents && selectedIndices.size < interactions.length) {
    const idx = Math.floor(rng.rand(0, interactions.length))
    if (!selectedIndices.has(idx)) {
      selectedIndices.add(idx)
      events.push(interactions[idx])
    }
  }

  return events
}

function generateNarration(creatures: Creature[], rng: SeededRng): string {
  const count = creatures.length
  const criticalCount = creatures.filter(c => c.severity === 'critical').length
  const highCount = creatures.filter(c => c.severity === 'high').length

  const narrations = [
    `In the shadowed depths of this repo, ${count} species ${count === 1 ? 'clashes' : 'clash'} for dominance...`,
    `The digital terrarium pulses with ${count} ${count === 1 ? 'lifeform' : 'lifeforms'}, each a manifestation of code gone wrong.`,
    `An unstable ecosystem emerges: ${count} bug creatures ${count === 1 ? 'roams' : 'roam'} the codebase, ${criticalCount > 0 ? 'with critical threats lurking' : 'seeking vulnerabilities'}.`,
    `Nature documentary voice: "Here we observe ${count} ${count === 1 ? 'specimen' : 'specimens'} in their natural habitat—a repository of chaos."`,
    `The codebase trembles as ${count} ${count === 1 ? 'entity' : 'entities'} ${count === 1 ? 'awakens' : 'awaken'}, ${highCount > 0 ? 'some more dangerous than others' : 'each with unique behaviors'}.`
  ]

  return rng.pick(narrations)
}

export function generateMockZooFromCode(code: string): MockZooResult {
  if (!code || code.trim().length === 0) {
    return {
      creatures: [],
      events: ["No code detected. The terrarium remains empty."],
      narration: "The digital terrarium awaits... Paste code to populate it with bug creatures."
    }
  }

  // Create deterministic RNG from code hash
  const seed = hashStringToSeed(code.trim())
  const rng = createSeededRng(seed)

  // Determine number of creatures based on code length
  const codeLength = code.length
  let numCreatures: number
  
  if (codeLength < 100) {
    numCreatures = 2
  } else if (codeLength < 500) {
    numCreatures = Math.floor(rng.rand(2, 4)) // 2 or 3
  } else if (codeLength < 2000) {
    numCreatures = Math.floor(rng.rand(3, 5)) // 3 or 4
  } else {
    numCreatures = Math.floor(rng.rand(4, 6)) // 4 or 5
  }

  // Select random archetypes deterministically
  const selectedArchetypes: BugArchetype[] = []
  const availableArchetypes = [...bugArchetypes]
  
  for (let i = 0; i < numCreatures && availableArchetypes.length > 0; i++) {
    const randomIndex = Math.floor(rng.rand(0, availableArchetypes.length))
    selectedArchetypes.push(availableArchetypes.splice(randomIndex, 1)[0])
  }

  // Generate creatures
  const creatures = selectedArchetypes.map((archetype, index) => 
    generateCreature(archetype, index, seed, rng)
  )

  // Generate events and narration
  const events = generateEvents(creatures, rng)
  const narration = generateNarration(creatures, rng)

  return {
    creatures,
    events,
    narration
  }
}

