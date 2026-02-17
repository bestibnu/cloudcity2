import { OceanBase } from './components/scene/OceanBase'
import { CloudCityScene } from './components/scene/CloudCityScene'
import { HUD } from './components/HUD'

export default function App() {
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#1a3a6e',
    }}>
      {/* Layer 1+2+3: Real ocean photo + sky + horizon blend */}
      <OceanBase />

      {/* Layer 4: Transparent WebGL — islands float on ocean */}
      <CloudCityScene />

      {/* Layer 5: HUD overlay */}
      <HUD />
    </div>
  )
}
