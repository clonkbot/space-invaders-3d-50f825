import { useEffect, useState } from 'react'

interface GameOverScreenProps {
  score: number
  highScore: number
  onRestart: () => void
}

export function GameOverScreen({ score, highScore, onRestart }: GameOverScreenProps) {
  const [visible, setVisible] = useState(false)
  const isNewHighScore = score >= highScore && score > 0

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(40,0,20,0.95) 0%, rgba(5,5,16,0.98) 100%)',
      }}
    >
      {/* Glitch effect background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)',
          animation: 'glitch 0.3s steps(2) infinite',
        }}
      />

      {/* Game Over Title */}
      <div className="relative mb-6 md:mb-8">
        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-[0.1em] relative"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: '#ff0044',
            textShadow: '0 0 20px #ff0044, 0 0 40px #ff0044, 0 0 60px #ff0044',
            animation: 'textFlicker 3s linear infinite',
          }}
        >
          GAME OVER
        </h1>

        {/* Glitch copies */}
        <h1
          className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl font-black tracking-[0.1em]"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff',
            clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
            animation: 'glitchTop 2s infinite',
            opacity: 0.8,
          }}
        >
          GAME OVER
        </h1>
        <h1
          className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl font-black tracking-[0.1em]"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: '#ff00ff',
            textShadow: '0 0 10px #ff00ff',
            clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
            animation: 'glitchBottom 2s infinite',
            opacity: 0.8,
          }}
        >
          GAME OVER
        </h1>
      </div>

      {/* New High Score badge */}
      {isNewHighScore && (
        <div
          className="mb-4 md:mb-6 px-4 md:px-6 py-2 border-2 border-yellow-400"
          style={{
            color: '#ffcc00',
            textShadow: '0 0 10px #ffcc00',
            boxShadow: '0 0 20px rgba(255,204,0,0.3)',
            animation: 'rainbowPulse 1s ease-in-out infinite',
          }}
        >
          <span className="text-sm md:text-lg tracking-[0.3em] font-bold uppercase">
            New High Score!
          </span>
        </div>
      )}

      {/* Score display */}
      <div className="mb-6 md:mb-10 text-center">
        <div className="text-xs md:text-sm tracking-[0.5em] text-cyan-500/50 uppercase mb-2">
          Final Score
        </div>
        <div
          className="text-4xl md:text-6xl font-bold tracking-wider"
          style={{
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
          }}
        >
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      {/* High score comparison */}
      <div className="mb-8 md:mb-12 text-center">
        <div className="text-[10px] md:text-xs tracking-[0.4em] text-fuchsia-500/50 uppercase mb-1">
          High Score
        </div>
        <div
          className="text-xl md:text-2xl font-bold"
          style={{
            color: '#ff00ff',
            textShadow: '0 0 5px #ff00ff',
          }}
        >
          {highScore.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="relative group px-8 md:px-12 py-3 md:py-4 text-base md:text-lg tracking-[0.3em] font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          color: '#00ffff',
          border: '2px solid #00ffff',
          background: 'rgba(0,255,255,0.1)',
          boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)',
        }}
      >
        <span className="relative z-10">Play Again</span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))',
          }}
        />
      </button>

      {/* Skull decoration */}
      <div className="absolute bottom-1/4 left-10 opacity-10">
        <div
          className="text-6xl md:text-8xl"
          style={{
            filter: 'drop-shadow(0 0 20px #ff0044)',
            animation: 'float 4s ease-in-out infinite',
          }}
        >
          ☠
        </div>
      </div>
      <div className="absolute top-1/4 right-10 opacity-10">
        <div
          className="text-4xl md:text-6xl"
          style={{
            filter: 'drop-shadow(0 0 20px #ff0044)',
            animation: 'float 4s ease-in-out infinite 0.5s',
          }}
        >
          ☠
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, 2px); }
          100% { transform: translate(0); }
        }
        @keyframes glitchTop {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-3px, 0); }
          94% { transform: translate(3px, 0); }
          96% { transform: translate(-3px, 0); }
          98% { transform: translate(3px, 0); }
        }
        @keyframes glitchBottom {
          0%, 90%, 100% { transform: translate(0); }
          91% { transform: translate(3px, 0); }
          93% { transform: translate(-3px, 0); }
          95% { transform: translate(3px, 0); }
          97% { transform: translate(-3px, 0); }
        }
        @keyframes textFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          95% { opacity: 0.9; }
          96% { opacity: 1; }
        }
        @keyframes rainbowPulse {
          0%, 100% {
            border-color: #ffcc00;
            box-shadow: 0 0 20px rgba(255,204,0,0.3);
          }
          33% {
            border-color: #ff00ff;
            box-shadow: 0 0 20px rgba(255,0,255,0.3);
          }
          66% {
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0,255,255,0.3);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
