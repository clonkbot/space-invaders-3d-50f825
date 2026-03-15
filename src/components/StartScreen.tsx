import { useEffect, useState } from 'react'

interface StartScreenProps {
  onStart: () => void
  highScore: number
}

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  const [visible, setVisible] = useState(false)
  const [letterIndex, setLetterIndex] = useState(0)

  const title = 'SPACE INVADERS'

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => {
      setLetterIndex((prev) => {
        if (prev >= title.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(20,0,40,0.9) 0%, rgba(5,5,16,0.95) 100%)',
      }}
    >
      {/* Animated background grid lines */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255,0,255,0.3) 25%, rgba(255,0,255,0.3) 26%, transparent 27%, transparent 74%, rgba(255,0,255,0.3) 75%, rgba(255,0,255,0.3) 76%, transparent 77%),
            linear-gradient(90deg, transparent 24%, rgba(0,255,255,0.3) 25%, rgba(0,255,255,0.3) 26%, transparent 27%, transparent 74%, rgba(0,255,255,0.3) 75%, rgba(0,255,255,0.3) 76%, transparent 77%)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Title */}
      <div className="relative mb-6 md:mb-10">
        <h1
          className="text-3xl sm:text-5xl md:text-7xl font-black tracking-[0.2em] relative z-10"
          style={{
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {title.split('').map((letter, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-300"
              style={{
                color: i < letterIndex ? (i % 2 === 0 ? '#00ffff' : '#ff00ff') : 'transparent',
                textShadow: i < letterIndex
                  ? `0 0 10px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}, 0 0 20px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}, 0 0 40px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`
                  : 'none',
                transform: i < letterIndex ? 'translateY(0)' : 'translateY(-20px)',
                opacity: i < letterIndex ? 1 : 0,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        {/* Decorative lines */}
        <div
          className="absolute -left-4 md:-left-10 top-1/2 w-8 md:w-20 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #ff00ff)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -right-4 md:-right-10 top-1/2 w-8 md:w-20 h-[2px]"
          style={{
            background: 'linear-gradient(270deg, transparent, #00ffff)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Subtitle */}
      <p
        className="text-xs md:text-sm tracking-[0.5em] text-cyan-400/60 mb-8 md:mb-12 uppercase"
        style={{
          animation: 'fadeIn 1s ease-out 1.5s both',
        }}
      >
        Defend Earth
      </p>

      {/* Start button */}
      <button
        onClick={onStart}
        className="relative group px-8 md:px-12 py-3 md:py-4 text-base md:text-lg tracking-[0.3em] font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          color: '#00ffff',
          border: '2px solid #00ffff',
          background: 'rgba(0,255,255,0.1)',
          boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)',
          animation: 'fadeIn 1s ease-out 2s both, buttonPulse 2s ease-in-out infinite 2s',
        }}
      >
        <span className="relative z-10">Start Game</span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))',
          }}
        />
      </button>

      {/* High score */}
      {highScore > 0 && (
        <div
          className="mt-6 md:mt-10 text-center"
          style={{
            animation: 'fadeIn 1s ease-out 2.5s both',
          }}
        >
          <div className="text-[10px] md:text-xs tracking-[0.4em] text-fuchsia-500/50 uppercase mb-1">
            High Score
          </div>
          <div
            className="text-xl md:text-2xl font-bold"
            style={{
              color: '#ff00ff',
              textShadow: '0 0 10px #ff00ff',
            }}
          >
            {highScore.toString().padStart(6, '0')}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div
        className="absolute bottom-20 md:bottom-24 left-0 right-0 text-center"
        style={{
          animation: 'fadeIn 1s ease-out 3s both',
        }}
      >
        <p className="hidden md:block text-xs tracking-[0.2em] text-cyan-500/40 uppercase">
          Use [A/D] or [Arrow Keys] to move &middot; [SPACE] to fire
        </p>
        <p className="md:hidden text-xs tracking-[0.2em] text-cyan-500/40 uppercase">
          Touch screen to move &middot; Tap to fire
        </p>
      </div>

      {/* Decorative aliens */}
      <div className="absolute top-10 md:top-20 left-1/4 opacity-20">
        <div
          className="w-6 h-6 md:w-10 md:h-10"
          style={{
            background: '#ff00ff',
            clipPath: 'polygon(50% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            animation: 'float 3s ease-in-out infinite',
          }}
        />
      </div>
      <div className="absolute top-16 md:top-32 right-1/4 opacity-20">
        <div
          className="w-8 h-8 md:w-12 md:h-12"
          style={{
            background: '#00ffff',
            clipPath: 'polygon(50% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            animation: 'float 3s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(0,255,255,0.5), inset 0 0 30px rgba(0,255,255,0.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
