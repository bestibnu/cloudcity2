import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { RegionIsland } from './RegionIsland'
import { useStore } from '../../store/store'

// Camera positions - world view sits at ocean level looking at horizon
const WORLD_POS: [number, number, number]    = [0, 2.8, 18]
const WORLD_TARGET: [number, number, number] = [0, 0.5, 0]

function CameraController() {
  const { camera } = useThree()
  const { selectedRegionId, organization } = useStore()

  const tPos = useRef(new THREE.Vector3(...WORLD_POS))
  const tLook = useRef(new THREE.Vector3(...WORLD_TARGET))
  const cLook = useRef(new THREE.Vector3(...WORLD_TARGET))

  useFrame(() => {
    // Compute target based on selection
    if (selectedRegionId) {
      const r = organization.regions.find((x) => x.id === selectedRegionId)
      if (r) {
        const [rx, , rz] = r.position
        tPos.current.set(rx, 14, rz + 20)
        tLook.current.set(rx, 0, rz)
      }
    } else {
      tPos.current.set(...WORLD_POS)
      tLook.current.set(...WORLD_TARGET)
    }

    camera.position.lerp(tPos.current, 0.05)
    cLook.current.lerp(tLook.current, 0.05)
    camera.lookAt(cLook.current)
  })

  return null
}

function Islands() {
  const { organization } = useStore()
  return (
    <>
      {organization.regions.map((r) => (
        <RegionIsland key={r.id} region={r} />
      ))}
    </>
  )
}

function SceneContents() {
  return (
    <>
      <PerspectiveCamera makeDefault position={WORLD_POS} fov={55} near={0.1} far={300} />
      <CameraController />

      {/* Lighting matched to the ocean photo's sunlight */}
      <ambientLight intensity={0.55} color="#b0d0e8" />
      <directionalLight position={[-3, 8, -10]} intensity={1.4} color="#fff4e0" />
      <pointLight position={[0, 6, 0]} intensity={0.4} color="#80c8ff" distance={80} />

      <Islands />
    </>
  )
}

export function CloudCityScene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,                         // transparent — ocean photo shows through
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,                           // sits above ocean photo layers
        background: 'transparent',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
