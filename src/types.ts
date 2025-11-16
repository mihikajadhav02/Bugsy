export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type BreedType = 'memory' | 'concurrency' | 'logic' | 'syntax' | 'performance' | 'architecture' | 'indexing' | 'safety' | 'control_flow' | 'logging';
export type Status = 'Roaming' | 'Hunting' | 'Sleeping' | 'Reproducing' | 'Evolving' | 'Extinct' | 'Newly spawned' | 'Clashing' | 'Competing' | 'Hybrid offspring';

export interface Creature {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  breedType: BreedType;
  bugLabel: string;
  bugCategory: string;
  hp: number;
  aggression: number;
  speed: number;
  reproductionRate: number;
  status: Status;
  imageUrl?: string;
}

export interface EcosystemStats {
  totalCreatures: number;
  totalHP: number;
  averageAggression: number;
  activeThreats: number;
}

