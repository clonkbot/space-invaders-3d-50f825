import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Explosion } from './Game'

interface ExplosionsProps {
  explosions: Explosion[]
}

function ExplosionMesh({ startTime }: { startTime: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Mesh[]>([])

  // Generate random particle directions
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      direction: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#ff00ff' : Math.random() > 0.5 ? '#00ffff' : '#ffaa00',
    }))
  }, [])

  useFrame(() => {
    const elapsed = (Date.now() - startTime) / 1000
    const progress = Math.min(elapsed / 0.5, 1)

    particlesRef.current.forEach((mesh, i) => {
      if (mesh) {
        const particle = particles[i]
        const dist = particle.speed * elapsed
        mesh.position.copy(particle.direction).multiplyScalar(dist)
        mesh.scale.setScalar(1 - progress)
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.opacity = 1 - progress
        }
      }
    })

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central flash */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Particles */}
      {particles.map((particle, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el
          }}
        >
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color={particle.color} transparent opacity={1} />
        </mesh>
      ))}

      {/* Expanding ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow */}
      <pointLight color="#ff00ff" intensity={5} distance={5} decay={2} />
    </group>
  )
}

export function Explosions({ explosions }: ExplosionsProps) {
  return (
    <group>
      {explosions.map((explosion) => (
        <group key={explosion.id} position={explosion.position.toArray()}>
          <ExplosionMesh startTime={explosion.startTime} />
        </group>
      ))}
    </group>
  )
}
