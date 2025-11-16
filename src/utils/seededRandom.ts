/**
 * Seeded random number generator utilities for deterministic randomness.
 * Uses mulberry32 PRNG algorithm for fast, high-quality pseudo-random numbers.
 */

/**
 * Hashes a string into a 32-bit integer seed.
 * Uses a simple but effective hash function (djb2 variant).
 */
export function hashStringToSeed(input: string): number {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash >>> 0 // Ensure unsigned 32-bit
}

/**
 * Creates a seeded random number generator using mulberry32 algorithm.
 * Returns an object with methods for generating deterministic random numbers.
 */
export function createSeededRng(seed: number) {
  let state = seed >>> 0 // Ensure unsigned 32-bit

  // Mulberry32 PRNG
  function next(): number {
    state += 0x6D2B79F5
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t = t ^ Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296 // Convert to [0, 1)
  }

  return {
    /**
     * Returns a random number.
     * If min and max are provided, returns a number in [min, max).
     * Otherwise returns a number in [0, 1).
     */
    rand(min?: number, max?: number): number {
      const value = next()
      if (min !== undefined && max !== undefined) {
        return min + value * (max - min)
      }
      return value
    },

    /**
     * Picks a random element from an array using the seeded RNG.
     */
    pick<T>(arr: T[]): T {
      if (arr.length === 0) {
        throw new Error('Cannot pick from empty array')
      }
      const index = Math.floor(this.rand(0, arr.length))
      return arr[index]
    }
  }
}

export type SeededRng = ReturnType<typeof createSeededRng>

