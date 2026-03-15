import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Player } from './Player'
import { Invaders } from './Invaders'
import { Bullets } from './Bullets'
import { Explosions } from './Explosions'
import { GridFloor } from './GridFloor'
import type { GameState } from '../App'

interface GameProps {
  gameState: GameState
  addScore: (points: number) => void
  loseLife: () => void
  nextWave: () => void
  wave: number
}

export interface Bullet {
  id: number
  position: THREE.Vector3
  isEnemy: boolean
}

export interface Invader {
  id: number
  position: THREE.Vector3
  type: number
  alive: boolean
}

export interface Explosion {
  id: number
  position: THREE.Vector3
  startTime: number
}

let bulletIdCounter = 0
let explosionIdCounter = 0

export function Game({ gameState, addScore, loseLife, nextWave, wave }: GameProps) {
  const playerRef = useRef<THREE.Group>(null)
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 6))
  const bulletsRef = useRef<Bullet[]>([])
  const invadersRef = useRef<Invader[]>([])
  const explosionsRef = useRef<Explosion[]>([])
  const invaderDirRef = useRef(1)
  const invaderSpeedRef = useRef(0.02)
  const lastEnemyShootRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const lastShootRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const { gl } = useThree()

  // Force re-renders
  const forceUpdate = useCallback(() => {
    // Create new arrays to trigger updates
    bulletsRef.current = [...bulletsRef.current]
    invadersRef.current = [...invadersRef.current]
    explosionsRef.current = [...explosionsRef.current]
  }, [])

  // Initialize invaders
  const initInvaders = useCallback(() => {
    const newInvaders: Invader[] = []
    const rows = Math.min(3 + Math.floor(wave / 2), 5)
    const cols = Math.min(6 + wave, 11)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newInvaders.push({
          id: row * cols + col,
          position: new THREE.Vector3(
            (col - cols / 2 + 0.5) * 1.5,
            0,
            -8 + row * 1.2
          ),
          type: row % 3,
          alive: true,
        })
      }
    }
    invadersRef.current = newInvaders
    invaderDirRef.current = 1
    invaderSpeedRef.current = 0.02 + wave * 0.005
  }, [wave])

  // Reset game
  useEffect(() => {
    if (gameState === 'playing') {
      bulletsRef.current = []
      explosionsRef.current = []
      playerPosRef.current.set(0, 0, 6)
      initInvaders()
    }
  }, [gameState, initInvaders])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch controls
  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && touchStartRef.current) {
        const deltaX = e.touches[0].clientX - touchStartRef.current.x
        playerPosRef.current.x += deltaX * 0.02
        playerPosRef.current.x = Math.max(-8, Math.min(8, playerPosRef.current.x))
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchEnd = () => {
      // Shoot on touch end (tap)
      if (gameState === 'playing') {
        const now = Date.now()
        if (now - lastShootRef.current > 250) {
          bulletsRef.current.push({
            id: bulletIdCounter++,
            position: playerPosRef.current.clone(),
            isEnemy: false,
          })
          lastShootRef.current = now
        }
      }
      touchStartRef.current = null
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gl, gameState])

  // Shoot player bullet
  const shootBullet = useCallback(() => {
    const now = Date.now()
    if (now - lastShootRef.current > 250) {
      bulletsRef.current.push({
        id: bulletIdCounter++,
        position: playerPosRef.current.clone(),
        isEnemy: false,
      })
      lastShootRef.current = now
    }
  }, [])

  // Enemy shooting
  const enemyShoot = useCallback(() => {
    const aliveInvaders = invadersRef.current.filter(inv => inv.alive)
    if (aliveInvaders.length === 0) return

    const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
    bulletsRef.current.push({
      id: bulletIdCounter++,
      position: shooter.position.clone(),
      isEnemy: true,
    })
  }, [])

  // Create explosion
  const createExplosion = useCallback((position: THREE.Vector3) => {
    explosionsRef.current.push({
      id: explosionIdCounter++,
      position: position.clone(),
      startTime: Date.now(),
    })
  }, [])

  // Game loop
  useFrame((state, delta) => {
    if (gameState !== 'playing') return

    const keys = keysRef.current
    const moveSpeed = 10 * delta

    // Player movement
    if (keys.has('ArrowLeft') || keys.has('KeyA')) {
      playerPosRef.current.x -= moveSpeed
    }
    if (keys.has('ArrowRight') || keys.has('KeyD')) {
      playerPosRef.current.x += moveSpeed
    }
    playerPosRef.current.x = Math.max(-8, Math.min(8, playerPosRef.current.x))

    // Shooting
    if (keys.has('Space')) {
      shootBullet()
    }

    // Update player visual
    if (playerRef.current) {
      playerRef.current.position.copy(playerPosRef.current)
    }

    // Move bullets
    bulletsRef.current.forEach(bullet => {
      bullet.position.z += bullet.isEnemy ? 15 * delta : -20 * delta
    })

    // Remove off-screen bullets
    bulletsRef.current = bulletsRef.current.filter(
      bullet => bullet.position.z > -15 && bullet.position.z < 10
    )

    // Move invaders
    let shouldMoveDown = false
    const aliveInvaders = invadersRef.current.filter(inv => inv.alive)

    aliveInvaders.forEach(invader => {
      invader.position.x += invaderSpeedRef.current * invaderDirRef.current
      if (Math.abs(invader.position.x) > 8) {
        shouldMoveDown = true
      }
    })

    if (shouldMoveDown) {
      invaderDirRef.current *= -1
      aliveInvaders.forEach(invader => {
        invader.position.z += 0.5
        // Check if invaders reached player
        if (invader.position.z > 5) {
          loseLife()
        }
      })
    }

    // Enemy shooting
    const now = Date.now()
    const shootInterval = Math.max(500, 2000 - wave * 100)
    if (now - lastEnemyShootRef.current > shootInterval) {
      enemyShoot()
      lastEnemyShootRef.current = now
    }

    // Collision detection - player bullets vs invaders
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      if (bullet.isEnemy) return true

      for (const invader of invadersRef.current) {
        if (!invader.alive) continue
        const dist = bullet.position.distanceTo(invader.position)
        if (dist < 0.8) {
          invader.alive = false
          createExplosion(invader.position)
          const points = (3 - invader.type) * 10 + wave * 5
          addScore(points)
          return false
        }
      }
      return true
    })

    // Collision detection - enemy bullets vs player
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      if (!bullet.isEnemy) return true
      const dist = bullet.position.distanceTo(playerPosRef.current)
      if (dist < 1) {
        createExplosion(playerPosRef.current)
        loseLife()
        return false
      }
      return true
    })

    // Clean up old explosions
    explosionsRef.current = explosionsRef.current.filter(
      exp => now - exp.startTime < 500
    )

    // Check wave completion
    if (aliveInvaders.length === 0) {
      nextWave()
      initInvaders()
    }

    forceUpdate()
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.15} color="#8080ff" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#00ffff" />
      <pointLight position={[-10, 5, 0]} intensity={0.8} color="#ff00ff" />
      <pointLight position={[10, 5, -5]} intensity={0.8} color="#00ff88" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      {/* Grid floor */}
      <GridFloor />

      {/* Player */}
      {gameState === 'playing' && (
        <Player ref={playerRef} position={playerPosRef.current} />
      )}

      {/* Invaders */}
      <Invaders invaders={invadersRef.current} />

      {/* Bullets */}
      <Bullets bullets={bulletsRef.current} />

      {/* Explosions */}
      <Explosions explosions={explosionsRef.current} />
    </>
  )
}
