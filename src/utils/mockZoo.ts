import { Creature, Severity, BreedType, Status } from '../types'
import { hashStringToSeed, createSeededRng, SeededRng } from './seededRandom'

export interface MockZooResult {
  creatures: Creature[]
  events: string[]
  narration: string
}

interface BugArchetype {
  name: string
  bugLabel: string
  bugCategory: string
  description: string
  severity: Severity
  breedType: BreedType
}

const bugArchetypes: BugArchetype[] = [
  {
    name: "Glow Moth",
    bugLabel: "💧 Memory Leak",
    bugCategory: "memory_leak",
    description: "A luminous moth that drips stored data wherever it goes, slowly flooding the heap with glowing residue.",
    severity: "high",
    breedType: "memory"
  },
  {
    name: "Tangled Worm",
    bugLabel: "🍝 Spaghetti Code",
    bugCategory: "spaghetti_code",
    description: "A rainbow worm made of twisted logic strands, impossible to straighten without breaking something else.",
    severity: "medium",
    breedType: "architecture"
  },
  {
    name: "Void Beetle",
    bugLabel: "⛔ Null Pointer",
    bugCategory: "null_pointer",
    description: "A hollow-shelled beetle that represents missing values and unchecked assumptions, crashing anything that touches its void.",
    severity: "high",
    breedType: "safety"
  },
  {
    name: "Offset Ant",
    bugLabel: "➕1 Off-by-one",
    bugCategory: "off_by_one",
    description: "An over-eager ant that always overshoots or undershoots the target slot by one tiny step.",
    severity: "medium",
    breedType: "indexing"
  },
  {
    name: "Flash Mantis",
    bugLabel: "⚡ Race Condition",
    bugCategory: "race_condition",
    description: "A hyper-fast mantis that acts before the rest of the system is ready, causing unpredictable outcomes.",
    severity: "critical",
    breedType: "concurrency"
  },
  {
    name: "Ring Cicada",
    bugLabel: "∞ Infinite Loop",
    bugCategory: "infinite_loop",
    description: "A cicada that sings the same cycle forever, looping in a glowing ring without ever reaching a return.",
    severity: "critical",
    breedType: "control_flow"
  },
  {
    name: "Rune Spider",
    bugLabel: "{} Syntax Error",
    bugCategory: "syntax_error",
    description: "A spider that spins webs of broken symbols; one wrong rune and the whole structure collapses.",
    severity: "low",
    breedType: "syntax"
  },
  {
    name: "Blink Firefly",
    bugLabel: "📣 Log Spam",
    bugCategory: "log_spam",
    description: "An overexcited firefly that won't stop blinking, drowning the night (and your console) in noise.",
    severity: "low",
    breedType: "logging"
  }
]

const statuses: Status[] = ["Roaming", "Hunting", "Sleeping", "Reproducing", "Evolving"]

// Helper function to generate image URL from creature name
function getImageUrl(creatureName: string): string {
  // Check if it's a hybrid (contains "×")
  if (creatureName.includes('×')) {
    // Parse hybrid name: "Glow Moth × Flash Mantis" -> "glow-moth-flash-mantis"
    const parts = creatureName.split('×').map(part => 
      part.trim().toLowerCase().replace(/\s+/g, '-')
    )
    const hybridPath = parts.join('-')
    return `/hybrid/${hybridPath}.png`
  }
  
  // Regular bug: "Glow Moth" -> "glow-moth"
  const bugPath = creatureName.toLowerCase().replace(/\s+/g, '-')
  return `/bugs/${bugPath}.png`
}

// Pattern detection and mapping to bug categories
type CodePattern = 
  | 'potential_infinite_loop'
  | 'off_by_one_loop'
  | 'missing_resource_cleanup'
  | 'shared_mutation_no_lock'
  | 'generic_catch'
  | 'deep_nesting'
  | 'log_spam'
  | 'syntax_error'

function analyzeCodePatterns(code: string): CodePattern[] {
  const patterns: CodePattern[] = []

  // Check for infinite loops
  if (/(while\s*\([^)]*true[^)]*\)|for\s*\([^)]*;;[^)]*\))/i.test(code)) {
    patterns.push('potential_infinite_loop')
  }

  // Check for off-by-one patterns (loops with <= length or < length-1)
  if (/(for\s*\([^)]*<=\s*\w+\.length|for\s*\([^)]*<\s*\w+\.length\s*-\s*1)/i.test(code)) {
    patterns.push('off_by_one_loop')
  }

  // Check for missing resource cleanup (open files, connections without close)
  if (/(\.open\(|\.connect\(|new\s+\w+Stream\()/i.test(code) && !/(\.close\(|\.disconnect\(|finally)/i.test(code)) {
    patterns.push('missing_resource_cleanup')
  }

  // Check for shared mutation without locks (concurrent access patterns)
  if (/(\.push\(|\.pop\(|\.shift\(|\.unshift\(|\+\+|--)/i.test(code) && 
      !/(lock|mutex|synchronized|await|async)/i.test(code)) {
    patterns.push('shared_mutation_no_lock')
  }

  // Check for generic catch blocks
  if (/(catch\s*\([^)]*\)\s*\{[^}]*\}|catch\s*\{)/i.test(code) && 
      !/(catch\s*\([^)]*Error[^)]*\)|catch\s*\([^)]*Exception[^)]*\))/i.test(code)) {
    patterns.push('generic_catch')
  }

  // Check for deep nesting (multiple levels of braces)
  let maxDepth = 0
  let currentDepth = 0
  for (const char of code) {
    if (char === '{') {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    } else if (char === '}') {
      currentDepth--
    }
  }
  if (maxDepth > 4) {
    patterns.push('deep_nesting')
  }

  // Check for log spam (multiple console.log/print statements)
  const logMatches = code.match(/(console\.(log|error|warn|info)|print\()/gi)
  if (logMatches && logMatches.length > 5) {
    patterns.push('log_spam')
  }

  // Check for syntax errors (unclosed brackets, quotes, etc.)
  const openBraces = (code.match(/\{/g) || []).length
  const closeBraces = (code.match(/\}/g) || []).length
  const openParens = (code.match(/\(/g) || []).length
  const closeParens = (code.match(/\)/g) || []).length
  const openBrackets = (code.match(/\[/g) || []).length
  const closeBrackets = (code.match(/\]/g) || []).length
  if (openBraces !== closeBraces || openParens !== closeParens || openBrackets !== closeBrackets) {
    patterns.push('syntax_error')
  }

  return patterns
}

// Map detected patterns to bug categories
function patternToBugCategory(pattern: CodePattern): string {
  const mapping: Record<CodePattern, string> = {
    'potential_infinite_loop': 'infinite_loop',
    'off_by_one_loop': 'off_by_one',
    'missing_resource_cleanup': 'memory_leak',
    'shared_mutation_no_lock': 'race_condition',
    'generic_catch': 'null_pointer',
    'deep_nesting': 'spaghetti_code',
    'log_spam': 'log_spam',
    'syntax_error': 'syntax_error'
  }
  return mapping[pattern]
}

// Find archetype by bug category
function findArchetypeByCategory(category: string): BugArchetype | null {
  return bugArchetypes.find(arch => arch.bugCategory === category) || null
}

function generateCreature(archetype: BugArchetype, index: number, seed: number, rng: SeededRng): Creature {
  // Use seed + index to create unique deterministic IDs
  const idSeed = seed + index * 1000
  const idRng = createSeededRng(idSeed)
  const idNumber = Math.floor(idRng.rand(1000000, 10000000))
  
  return {
    id: `creature-${idNumber}-${index}`,
    name: archetype.name,
    bugLabel: archetype.bugLabel,
    bugCategory: archetype.bugCategory,
    description: archetype.description,
    severity: archetype.severity,
    breedType: archetype.breedType,
    imageUrl: getImageUrl(archetype.name),
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

  // Analyze code patterns
  const detectedPatterns = analyzeCodePatterns(code)
  const selectedArchetypes: BugArchetype[] = []
  const usedCategories = new Set<string>()

  // Map detected patterns to archetypes
  for (const pattern of detectedPatterns) {
    const category = patternToBugCategory(pattern)
    if (!usedCategories.has(category)) {
      const archetype = findArchetypeByCategory(category)
      if (archetype) {
        selectedArchetypes.push(archetype)
        usedCategories.add(category)
      }
    }
  }

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

  // Fill remaining slots with random archetypes if needed
  const availableArchetypes = bugArchetypes.filter(arch => !usedCategories.has(arch.bugCategory))
  
  while (selectedArchetypes.length < numCreatures && availableArchetypes.length > 0) {
    const randomIndex = Math.floor(rng.rand(0, availableArchetypes.length))
    const selected = availableArchetypes.splice(randomIndex, 1)[0]
    selectedArchetypes.push(selected)
    usedCategories.add(selected.bugCategory)
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

