export interface RegionMetrics {
  totalCost: number
  resourceCount: number
  riskScore: number
  growthRate: number
}

export interface Service {
  id: string
  type: 'compute' | 'database' | 'storage' | 'network'
  name: string
  cost: number
}

export interface AvailabilityZone {
  id: string
  name: string
  services: Service[]
  cost: number
}

export interface VPC {
  id: string
  name: string
  cidr: string
  availabilityZones: AvailabilityZone[]
  cost: number
}

export interface Region {
  id: string
  name: string
  code: string
  position: [number, number, number]
  vpcs: VPC[]
  metrics: RegionMetrics
}

export interface Organization {
  id: string
  name: string
  regions: Region[]
}

export type ViewMode = 'world' | 'region'
export type InteractionMode = 'architecture' | 'cost' | 'fault' | 'growth' | 'density'
