import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Invader } from './Game'

interface InvadersProps {
  invaders: Invader[]
}

// Different invader designs
function InvaderMesh({ type }: { type: number }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.rotation.y = Math.sin(t * 2) * 0.3
      meshRef.current.position.y = Math.sin(t * 3) * 0.1
    }
  })

  const colors = useMemo(() => {
    const colorSets = [
      { main: '#ff0066', emissive: '#ff0066' }, // Pink
      { main: '#00ff88', emissive: '#00ff88' }, // Green
      { main: '#ffaa00', emissive: '#ffaa00' }, // Orange
    ]
    return colorSets[type] || colorSets[0]
  }, [type])

  if (type === 0) {
    // Squid-like invader
    return (
      <group ref={meshRef}>
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.3]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.3]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Tentacles */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, -0.3, 0]} rotation={[0, 0, x * 0.5]}>
            <cylinderGeometry args={[0.04, 0.02, 0.3, 6]} />
            <meshStandardMaterial
              color={colors.main}
              emissive={colors.emissive}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (type === 1) {
    // Crab-like invader
    return (
      <group ref={meshRef}>
        <mesh>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Claws */}
        <mesh position={[-0.5, 0, 0.1]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0.5, 0, 0.1]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.2, 0.15]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.2, 0.15]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  // UFO-like invader (type 2)
  return (
    <group ref={meshRef}>
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 0.2, 8]} />
        <meshStandardMaterial
          color={colors.main}
          emissive={colors.emissive}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#aaffff"
          emissive="#aaffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Lights around edge */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.4, -0.05, Math.sin(angle) * 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff00ff' : '#00ffff'} />
          </mesh>
        )
      })}
    </group>
  )
}

export function Invaders({ invaders }: InvadersProps) {
  return (
    <group>
      {invaders.map((invader) =>
        invader.alive ? (
          <group key={invader.id} position={invader.position.toArray()}>
            <InvaderMesh type={invader.type} />
            {/* Glow light */}
            <pointLight
              color={invader.type === 0 ? '#ff0066' : invader.type === 1 ? '#00ff88' : '#ffaa00'}
              intensity={0.5}
              distance={2}
            />
          </group>
        ) : null
      )}
    </group>
  )
}
