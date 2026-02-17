import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Region } from '../../types'
import { useStore } from '../../store/store'

interface Props { region: Region }

export function RegionIsland({ region }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const floatRef = useRef<THREE.Group>(null)

  const { selectedRegionId, hoveredRegionId, viewMode, selectRegion, hoverRegion } = useStore()

  const isSelected = selectedRegionId === region.id
  const isHovered  = hoveredRegionId  === region.id
  const color      = '#00d4ff'
  const [rx, , rz] = region.position

  // Buildings per VPC — height = log(cost+1) * scale (from spec)
  const buildings = useMemo(() => region.vpcs.map((vpc, i) => {
    const angle  = (i / region.vpcs.length) * Math.PI * 2
    const radius = 2.4
    return {
      id: vpc.id,
      bx: Math.cos(angle) * radius,
      bz: Math.sin(angle) * radius,
      height: Math.log(vpc.cost / 1000 + 1) * 1.2,
    }
  }), [region.vpcs])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Gentle float
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(t * 0.55 + rx * 0.1) * 0.12
    }

    // Pulsing glow
    if (glowRef.current) {
      const pulse = 0.55 + Math.sin(t * 1.8) * 0.45
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (isHovered ? 0.60 : 0.22) * pulse
    }
  })

  return (
    <group ref={groupRef} position={[rx, 0, rz]}>

      {/* Outer glow ring */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[4.8, 9.0, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      <group ref={floatRef}>
        {/* Hex base platform */}
        <mesh
          onClick={(e) => { e.stopPropagation(); if (viewMode === 'world') selectRegion(isSelected ? null : region.id) }}
          onPointerEnter={(e) => { e.stopPropagation(); hoverRegion(region.id) }}
          onPointerLeave={(e) => { e.stopPropagation(); hoverRegion(null) }}
          castShadow
        >
          <cylinderGeometry args={[4.4, 4.8, 0.38, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHovered ? 1.1 : 0.55}
            metalness={0.70}
            roughness={0.15}
          />
        </mesh>

        {/* Hex top ring detail */}
        <mesh position={[0, 0.20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.0, 4.4, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.60} />
        </mesh>

        {/* VPC buildings */}
        {buildings.map((b) => (
          <group key={b.id} position={[b.bx, 0.19, b.bz]}>
            <mesh position={[0, b.height / 2, 0]}>
              <boxGeometry args={[0.6, b.height, 0.6]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.40}
                metalness={0.85}
                roughness={0.10}
              />
            </mesh>
            {/* Building top glow */}
            <pointLight
              position={[0, b.height + 0.3, 0]}
              color={color}
              intensity={0.4}
              distance={3}
            />
          </group>
        ))}

        {/* Region code label */}
        <Html position={[0, 4.5, 0]} center distanceFactor={44} occlude>
          <div style={{
            background: 'rgba(0,0,0,0.80)',
            border: `1px solid ${color}`,
            borderRadius: 6,
            padding: '4px 12px',
            color: color,
            fontSize: 11,
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(6px)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {region.code}
          </div>
        </Html>

        {/* Cost badge */}
        <Html position={[0, 3.0, 0]} center distanceFactor={44} occlude>
          <div style={{
            color: 'rgba(255,255,255,0.50)',
            fontSize: 9,
            fontFamily: 'monospace',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            ${(region.metrics.totalCost / 1000).toFixed(1)}k/mo
          </div>
        </Html>
      </group>

      {/* Hover indicator ring */}
      {isHovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[5.1, 5.5, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.30} />
        </mesh>
      )}
    </group>
  )
}
