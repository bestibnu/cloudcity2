import { create } from 'zustand'
import { Organization, ViewMode, InteractionMode } from '../types'
import { MOCK_ORG } from '../data/mockData'

interface CloudCity2State {
  organization: Organization
  selectedRegionId: string | null
  hoveredRegionId: string | null
  viewMode: ViewMode
  interactionMode: InteractionMode
  isLoaded: boolean

  selectRegion: (id: string | null) => void
  hoverRegion: (id: string | null) => void
  goToWorld: () => void
  setInteractionMode: (m: InteractionMode) => void
  setLoaded: (v: boolean) => void
}

export const useStore = create<CloudCity2State>((set) => ({
  organization: MOCK_ORG,
  selectedRegionId: null,
  hoveredRegionId: null,
  viewMode: 'world',
  interactionMode: 'architecture',
  isLoaded: false,

  selectRegion: (id) => set((s) => ({
    selectedRegionId: id,
    viewMode: id ? 'region' : 'world',
    hoveredRegionId: null,
  })),

  hoverRegion: (id) => set({ hoveredRegionId: id }),

  goToWorld: () => set({
    selectedRegionId: null,
    viewMode: 'world',
  }),

  setInteractionMode: (m) => set({ interactionMode: m }),
  setLoaded: (v) => set({ isLoaded: v }),
}))
