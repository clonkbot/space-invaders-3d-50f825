import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)
  const planeRef = useRef<THREE.Mesh>(null)

  // Create animated grid material
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (gridRef.current) {
      gridRef.current.position.z = (t * 2) % 1
    }
    if (planeRef.current && planeRef.current.material instanceof THREE.MeshBasicMaterial) {
      planeRef.current.material.opacity = 0.05 + Math.sin(t) * 0.02
    }
  })

  // Create gradient texture for the floor
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 0, 256)
    gradient.addColorStop(0, '#ff00ff')
    gradient.addColorStop(0.5, '#000022')
    gradient.addColorStop(1, '#00ffff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1, 256)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <group position={[0, -1, 0]}>
      {/* Base plane with gradient */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[40, 60]} />
        <meshBasicMaterial
          map={gradientTexture}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated grid */}
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#ff00ff', '#00ffff']}
        position={[0, 0, 0]}
      />

      {/* Second grid for depth */}
      <gridHelper
        args={[40, 80, '#ff00ff', '#ff00ff']}
        position={[0, -0.05, 0]}
      />

      {/* Horizon glow */}
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[50, 10]} />
        <meshBasicMaterial
          color="#ff00ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Side barriers - left */}
      <mesh position={[-9, 1, -5]} rotation={[0, Math.PI / 12, 0]}>
        <boxGeometry args={[0.1, 2, 30]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Side barriers - right */}
      <mesh position={[9, 1, -5]} rotation={[0, -Math.PI / 12, 0]}>
        <boxGeometry args={[0.1, 2, 30]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}
