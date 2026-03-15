import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Bullet } from './Game'

interface BulletsProps {
  bullets: Bullet[]
}

function BulletMesh({ isEnemy }: { isEnemy: boolean }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime
      ref.current.scale.y = 1 + Math.sin(t * 20) * 0.2
    }
  })

  const color = isEnemy ? '#ff4444' : '#00ffff'

  return (
    <group>
      {/* Main bullet */}
      <mesh ref={ref}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Trail */}
      <mesh position={[0, isEnemy ? -0.3 : 0.3, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshBasicMaterial
          color={isEnemy ? '#ff8800' : '#00ff88'}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={color} intensity={1} distance={2} />
    </group>
  )
}

export function Bullets({ bullets }: BulletsProps) {
  return (
    <group>
      {bullets.map((bullet) => (
        <group
          key={bullet.id}
          position={bullet.position.toArray()}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <BulletMesh isEnemy={bullet.isEnemy} />
        </group>
      ))}
    </group>
  )
}
