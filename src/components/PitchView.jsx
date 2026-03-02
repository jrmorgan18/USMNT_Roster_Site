import { formations } from '../data/formations'

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function PitchView({ formation, startingXI, onSlotClick }) {
  const formationData = formations[formation]
  if (!formationData) return null

  return (
    <div className="pitch-container">
      <svg className="pitch-svg" viewBox="0 0 100 110" preserveAspectRatio="xMidYMid meet">
        {/* Pitch background */}
        <rect x="0" y="0" width="100" height="110" fill="#1B6B2E" />
        {/* Grass stripes */}
        {[0, 20, 40, 60, 80, 100].map((y) => (
          <rect key={y} x="0" y={y} width="100" height="10" fill="rgba(0,0,0,0.03)" />
        ))}
        {/* Outer boundary */}
        <rect x="3" y="3" width="94" height="104" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        {/* Halfway line */}
        <line x1="3" y1="55" x2="97" y2="55" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        {/* Center circle */}
        <circle cx="50" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <circle cx="50" cy="55" r="0.7" fill="rgba(255,255,255,0.5)" />
        {/* Top penalty box */}
        <rect x="22" y="3" width="56" height="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <rect x="32" y="3" width="36" height="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <circle cx="50" cy="14" r="0.7" fill="rgba(255,255,255,0.5)" />
        {/* Bottom penalty box */}
        <rect x="22" y="89" width="56" height="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <rect x="32" y="100" width="36" height="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <circle cx="50" cy="96" r="0.7" fill="rgba(255,255,255,0.5)" />
        {/* Corner arcs */}
        <path d="M3,6 A3,3 0 0,1 6,3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <path d="M94,3 A3,3 0 0,1 97,6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <path d="M3,104 A3,3 0 0,0 6,107" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <path d="M94,107 A3,3 0 0,0 97,104" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />

        {/* Position slots */}
        {formationData.positions.map((pos, idx) => {
          const player = startingXI[idx]
          const filled = !!player
          return (
            <g
              key={idx}
              className="position-slot"
              onClick={() => onSlotClick(idx)}
              transform={`translate(${pos.x}, ${pos.y})`}
            >
              {/* Slot circle */}
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill={filled ? '#002868' : 'rgba(255,255,255,0.15)'}
                stroke={filled ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                strokeWidth="0.4"
              />
              {/* Player initials or position label */}
              <text
                x="0"
                y="0.5"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="2.5"
                fontWeight="bold"
                fontFamily="-apple-system, sans-serif"
              >
                {filled ? getInitials(player.name) : pos.label}
              </text>
              {/* Player name below */}
              {filled && (
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  fill="white"
                  fontSize="2"
                  fontWeight="600"
                  fontFamily="-apple-system, sans-serif"
                >
                  {player.name.split(' ').pop()}
                </text>
              )}
              {/* Position label below when filled */}
              {filled && (
                <text
                  x="0"
                  y="9.5"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="1.5"
                  fontFamily="-apple-system, sans-serif"
                >
                  {pos.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
