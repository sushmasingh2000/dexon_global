export const LineChart = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-16">
        <svg viewBox="0 0 80 64" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="16" x2="80" y2="16" stroke="#1e3a4a" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="32" x2="80" y2="32" stroke="#1e3a4a" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="48" x2="80" y2="48" stroke="#1e3a4a" strokeWidth="0.5" opacity="0.3" />

            {/* Area under the line */}
            <path
                d="M 0 48 L 13.3 40 L 26.6 35 L 40 28 L 53.3 24 L 66.6 18 L 80 12 L 80 64 L 0 64 Z"
                fill="url(#areaGradient)"
                className="transition-all duration-1000 ease-out"
            />

            {/* Main line */}
            <polyline
                points="0,48 13.3,40 26.6,35 40,28 53.3,24 66.6,18 80,12"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000 ease-out"
            />

            {/* Data points */}
            <circle cx="0" cy="48" r="1.5" fill={color} opacity="0.6" />
            <circle cx="13.3" cy="40" r="1.5" fill={color} opacity="0.6" />
            <circle cx="26.6" cy="35" r="1.5" fill={color} opacity="0.6" />
            <circle cx="40" cy="28" r="1.5" fill={color} opacity="0.6" />
            <circle cx="53.3" cy="24" r="1.5" fill={color} opacity="0.6" />
            <circle cx="66.6" cy="18" r="1.5" fill={color} opacity="0.6" />

            {/* Current point (highlighted) */}
            <circle cx="80" cy="12" r="2.5" fill={color} className="animate-pulse" />
            <circle cx="80" cy="12" r="1.5" fill="#fff" />
        </svg>
    </div>
}
export const Barchart = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-16">
        <div className="absolute top-4 right-4 w-16 h-12 flex items-end justify-between gap-1">
            {[30, 45, 35, 60, 50, 75, 85].map((height, index) => (
                <div
                    key={index}
                    className="flex-1 rounded-t-sm transition-all duration-500 ease-out"
                    style={{
                        height: `${height}%`,
                        background: index === 6
                            ? `linear-gradient(to top, ${color}, ${color})`
                            : 'linear-gradient(to top, #1e3a4a, #2a5266)',
                        boxShadow: index === 6
                            ? '0 0 8px rgba(34, 211, 238, 0.5)'
                            : 'none',
                        animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                />
            ))}
        </div>

        {/* <style jsx>{`
    @keyframes slideUp {
      from {
        height: 0%;
        opacity: 0;
      }
      to {
        height: var(--final-height);
        opacity: 1;
      }
    }
  `}</style> */}
    </div>
}
export const AreaChart = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-14">
        <svg viewBox="0 0 80 56" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                {/* Gradient for the area fill */}
                <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                </linearGradient>

                {/* Gradient for the line */}
                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>

            {/* Filled area */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2
           L 80 56 L 0 56 Z"
                fill="url(#areaFillGradient)"
                className="transition-all duration-1000 ease-out"
            />

            {/* Top line stroke */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2"
                fill="none"
                stroke="url(#lineStrokeGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                    filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.5))'
                }}
            />

            {/* Current point indicator */}
            <circle
                cx="80"
                cy="2"
                r="3"
                fill={color}
                className="animate-pulse"
            >
                <animate
                    attributeName="r"
                    values="3;4;3"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="80" cy="2" r="1.5" fill="#fff" />
        </svg>
    </div>
}
export const RadialProgress = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-14">
        <svg viewBox="0 0 80 56" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                {/* Gradient for the area fill */}
                <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                </linearGradient>

                {/* Gradient for the line */}
                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
            </defs>

            {/* Filled area */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2
           L 80 56 L 0 56 Z"
                fill="url(#areaFillGradient)"
                className="transition-all duration-1000 ease-out"
            />

            {/* Top line stroke */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2"
                fill="none"
                stroke="url(#lineStrokeGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                    filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.5))'
                }}
            />

            {/* Current point indicator */}
            <circle
                cx="80"
                cy="2"
                r="3"
                fill={color}
                className="animate-pulse"
            >
                <animate
                    attributeName="r"
                    values="3;4;3"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="80" cy="2" r="1.5" fill="#fff" />
        </svg>
    </div>
}
export const WaveSparklineChart = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-14">
        <svg viewBox="0 0 80 56" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                {/* Gradient for the area fill */}
                <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>

                {/* Gradient for the line */}
                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
            </defs>

            {/* Filled area */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2
           L 80 56 L 0 56 Z"
                fill="url(#areaFillGradient)"
                className="transition-all duration-1000 ease-out"
            />

            {/* Top line stroke */}
            <path
                d="M 0 45 
           C 10 42, 15 38, 20 35
           C 25 32, 30 28, 35 25
           C 40 22, 45 18, 50 15
           C 55 12, 60 10, 65 8
           C 70 6, 75 4, 80 2"
                fill="none"
                stroke="url(#lineStrokeGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                    filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.5))'
                }}
            />

            {/* Current point indicator */}
            <circle
                cx="80"
                cy="2"
                r="3"
                fill={color}
                className="animate-pulse"
            >
                <animate
                    attributeName="r"
                    values="3;4;3"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="80" cy="2" r="1.5" fill="#fff" />
        </svg>
    </div>
}
export const AnimatedBars = ({ color = "#22d3ee" }) => {
    return <div className="absolute top-3 right-3 w-20 h-14">
        <div className="absolute top-3 right-3 w-16 h-14 flex items-end justify-between gap-0.5">
            {[40, 55, 45, 70, 60, 85, 95].map((height, index) => {
                const currentSlab = null || 10;
                const isActive = index < currentSlab;
                const isCurrent = index === currentSlab - 1;

                return (
                    <div key={index} className="flex-1 relative">
                        {/* Glow effect */}
                        {isCurrent && (
                            <div
                                className="absolute inset-0 rounded-t-sm animate-pulse"
                                style={{
                                    background: 'linear-gradient(to top, #22d3ee, #06b6d4)',
                                    filter: 'blur(4px)',
                                    opacity: 0.6,
                                }}
                            />
                        )}

                        {/* Main bar */}
                        <div
                            className="relative rounded-t-sm transition-all duration-700 ease-out"
                            style={{
                                height: `${height}%`,
                                background: isCurrent
                                    ? 'linear-gradient(to top, #06b6d4, #22d3ee)'
                                    : isActive
                                        ? 'linear-gradient(to top, #0e7490, #0891b2)'
                                        : 'linear-gradient(to top, #1e3a4a, #2a5266)',
                                boxShadow: isCurrent
                                    ? '0 0 12px rgba(34, 211, 238, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.2)'
                                    : isActive
                                        ? '0 0 6px rgba(8, 145, 178, 0.4)'
                                        : 'none',
                                opacity: isActive || isCurrent ? 1 : 0.4,
                                animation: `slideUp 0.8s ease-out ${index * 0.08}s both`,
                            }}
                        >
                            {/* Top highlight */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-sm"
                                style={{
                                    background: isCurrent ? '#fff' : 'transparent',
                                    opacity: 0.6,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>

        <style jsx>{`
    @keyframes slideUp {
      from {
        transform: scaleY(0);
        opacity: 0;
      }
      to {
        transform: scaleY(1);
        opacity: 1;
      }
    }
  `}</style>
    </div>
}