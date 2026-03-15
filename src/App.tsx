import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Game } from './components/Game'
import { HUD } from './components/HUD'
import { StartScreen } from './components/StartScreen'
import { GameOverScreen } from './components/GameOverScreen'

export type GameState = 'start' | 'playing' | 'gameover'

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('spaceInvadersHighScore')
    return saved ? parseInt(saved, 10) : 0
  })

  const startGame = useCallback(() => {
    setScore(0)
    setLives(3)
    setWave(1)
    setGameState('playing')
  }, [])

  const handleGameOver = useCallback(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('spaceInvadersHighScore', score.toString())
    }
    setGameState('gameover')
  }, [score, highScore])

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives(prev => {
      if (prev <= 1) {
        handleGameOver()
        return 0
      }
      return prev - 1
    })
  }, [handleGameOver])

  const nextWave = useCallback(() => {
    setWave(prev => prev + 1)
  }, [])

  return (
    <div className="w-screen h-dvh bg-black overflow-hidden relative font-mono">
      {/* Scanline overlay for CRT effect */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 15, 50]} />
        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            addScore={addScore}
            loseLife={loseLife}
            nextWave={nextWave}
            wave={wave}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {gameState === 'start' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {gameState === 'playing' && (
        <HUD score={score} lives={lives} wave={wave} highScore={highScore} />
      )}

      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          onRestart={startGame}
        />
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 z-30 text-center">
        <p className="text-[10px] md:text-xs text-cyan-900/60 tracking-widest font-light">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}
