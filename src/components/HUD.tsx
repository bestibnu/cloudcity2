import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Globe, DollarSign, Zap, TrendingUp, Activity } from 'lucide-react'
import { useStore } from '../store/store'
import type { InteractionMode } from '../types'

const MODES: Array<{ value: InteractionMode; label: string; Icon: React.FC<{ size?: number }> }> = [
  { value: 'architecture', label: 'Architecture', Icon: Globe      },
  { value: 'cost',         label: 'Cost',         Icon: DollarSign },
  { value: 'fault',        label: 'Fault',        Icon: Zap        },
  { value: 'growth',       label: 'Growth',       Icon: TrendingUp },
  { value: 'density',      label: 'Density',      Icon: Activity   },
]

export function HUD() {
  const { organization, selectedRegionId, viewMode, interactionMode, isLoaded, goToWorld, setInteractionMode } = useStore()
  const selectedRegion = organization.regions.find((r) => r.id === selectedRegionId)

  return (
    <>
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -12 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        style={{
          position: 'absolute', top: 20, left: 22, zIndex: 20,
          fontFamily: 'monospace', userSelect: 'none',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 15, fontWeight: 700, letterSpacing: '0.18em' }}>
          CLOUDCITY
        </div>
        <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 8, letterSpacing: '0.30em', marginTop: 3 }}>
          {organization.regions.length} REGION &nbsp;&middot;&nbsp; AWS VISUALIZATION
        </div>
      </motion.div>

      {/* Back button */}
      <AnimatePresence>
        {viewMode === 'region' && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1,  y: 0 }}
            exit={{   opacity: 0,  y: -10 }}
            onClick={goToWorld}
            style={{
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
              zIndex: 20, display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,0,0,0.60)', border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 8, padding: '8px 20px', color: 'rgba(255,255,255,0.88)',
              cursor: 'pointer', fontFamily: 'monospace', fontSize: 10,
              letterSpacing: '0.15em', backdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={13} /> WORLD VIEW
          </motion.button>
        )}
      </AnimatePresence>

      {/* Region info panel */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            key={selectedRegion.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1,  x: 0 }}
            exit={{   opacity: 0,  x: 16 }}
            style={{
              position: 'absolute', top: 20, right: 22, zIndex: 20,
              background: 'rgba(0,0,0,0.75)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: 10, padding: '18px 22px',
              fontFamily: 'monospace', backdropFilter: 'blur(14px)', minWidth: 240,
            }}
          >
            <div style={{ color: '#00d4ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 4 }}>
              {selectedRegion.code.toUpperCase()}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8, letterSpacing: '0.22em', marginBottom: 16 }}>
              {selectedRegion.name.toUpperCase()}
            </div>
            {[
              { label: 'MONTHLY COST',   value: '$' + selectedRegion.metrics.totalCost.toLocaleString()              },
              { label: 'RESOURCES',      value: selectedRegion.metrics.resourceCount                                  },
              { label: 'VPC COUNT',      value: selectedRegion.vpcs.length                                            },
              { label: 'RISK SCORE',     value: (selectedRegion.metrics.riskScore * 100).toFixed(0) + '%'             },
              { label: 'GROWTH RATE',    value: '+' + (selectedRegion.metrics.growthRate * 100).toFixed(0) + '%'      },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 8, letterSpacing: '0.20em' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode switcher */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 12 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', gap: 4,
          background: 'rgba(0,0,0,0.60)', border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 12, padding: '6px 10px', backdropFilter: 'blur(14px)',
        }}
      >
        {MODES.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setInteractionMode(value)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 13px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: interactionMode === value ? 'rgba(0,212,255,0.15)' : 'transparent',
              color: interactionMode === value ? '#00d4ff' : 'rgba(255,255,255,0.35)',
              fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.10em',
              transition: 'all 0.2s',
            }}
          >
            <Icon size={11} /> {label.toUpperCase()}
          </button>
        ))}
      </motion.div>

      {/* Hint */}
      <AnimatePresence>
        {viewMode === 'world' && isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5 }}
            style={{
              position: 'absolute', bottom: 74, left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.18)', fontSize: 8, fontFamily: 'monospace',
              letterSpacing: '0.35em', pointerEvents: 'none', zIndex: 20, whiteSpace: 'nowrap',
            }}
          >
            CLICK THE ISLAND TO EXPLORE
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
