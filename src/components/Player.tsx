import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface PlayerProps {
  position: THREE.Vector3
}

export const Player = forwardRef<THREE.Group, PlayerProps>(({ position }, ref) => {
  const glowRef = useRef<THREE.PointLight>(null)
  const engineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(t * 8) * 0.5
    }
    if (engineRef.current) {
      engineRef.current.scale.y = 0.8 + Math.sin(t * 15) * 0.2
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Main ship body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 1.5, 6]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wing left */}
      <mesh position={[-0.6, 0, 0.3]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wing right */}
      <mesh position={[0.6, 0, 0.3]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ffaa"
          emissive="#00ffaa"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Engine glow */}
      <mesh ref={engineRef} position={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.8} />
      </mesh>

      {/* Point light for glow */}
      <pointLight ref={glowRef} color="#00ffff" intensity={2} distance={4} />
    </group>
  )
})
