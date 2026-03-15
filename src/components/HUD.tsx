interface HUDProps {
  score: number
  lives: number
  wave: number
  highScore: number
}

export function HUD({ score, lives, wave, highScore }: HUDProps) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 p-3 md:p-6 pointer-events-none">
      {/* Top bar with score and lives */}
      <div className="flex justify-between items-start gap-2">
        {/* Score section */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] md:text-xs tracking-[0.3em] text-cyan-500/70 uppercase">
            Score
          </div>
          <div
            className="text-2xl md:text-4xl font-bold tracking-wider"
            style={{
              color: '#00ffff',
              textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
            }}
          >
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        {/* Wave indicator */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] md:text-xs tracking-[0.3em] text-fuchsia-500/70 uppercase">
            Wave
          </div>
          <div
            className="text-xl md:text-3xl font-bold"
            style={{
              color: '#ff00ff',
              textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff',
            }}
          >
            {wave}
          </div>
        </div>

        {/* Lives section */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] md:text-xs tracking-[0.3em] text-cyan-500/70 uppercase">
            Lives
          </div>
          <div className="flex gap-1 md:gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 md:w-6 md:h-6 transition-all duration-300"
                style={{
                  opacity: i < lives ? 1 : 0.2,
                  transform: i < lives ? 'scale(1)' : 'scale(0.8)',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path
                    d="M12 4L14 10H20L15 14L17 20L12 16L7 20L9 14L4 10H10L12 4Z"
                    fill={i < lives ? '#00ffff' : '#333'}
                    style={{
                      filter: i < lives ? 'drop-shadow(0 0 4px #00ffff)' : 'none',
                    }}
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High score - bottom left corner */}
      <div className="absolute bottom-16 md:bottom-20 left-3 md:left-6">
        <div className="text-[8px] md:text-[10px] tracking-[0.2em] text-fuchsia-500/50 uppercase mb-0.5">
          High Score
        </div>
        <div
          className="text-sm md:text-lg font-bold"
          style={{
            color: '#ff00ff',
            textShadow: '0 0 5px #ff00ff',
            opacity: 0.7,
          }}
        >
          {highScore.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-16 md:bottom-20 right-3 md:right-6 text-right">
        <div className="hidden md:block text-[8px] md:text-[10px] tracking-wider text-cyan-500/40 uppercase">
          <span className="mr-2">[A/D] Move</span>
          <span>[SPACE] Fire</span>
        </div>
        <div className="md:hidden text-[8px] tracking-wider text-cyan-500/40 uppercase">
          Touch to Move & Shoot
        </div>
      </div>
    </div>
  )
}
