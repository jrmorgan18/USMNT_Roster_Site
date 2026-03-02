import { useState } from 'react'

const PLAYERS_WITH_PHOTOS = new Set([
  // GK
  'turner', 'steffen', 'horvath', 'freese', 'schulte', 'callender', 'brady',
  'kochen',
  // DEF
  'dest', 'scally', 'robinson_a', 'richards', 'carter_vickers', 'trusty', 'ream',
  'zimmerman', 'miles_robinson', 'mckenzie', 'tolkin', 'wiley', 'harriel',
  'moore', 'campbell', 'banks', 'freeman', 'arfsten',
  // MID
  'mckennie', 'adams', 'musah', 'reyna', 'tillman_m', 'cardoso', 'busio',
  'tessmann', 'aaronson_b', 'mcglynn', 'delatorre', 'sands', 'roldan',
  'cremaschi', 'mihailovic', 'luna', 'berhalter_s', 'vassilev', 'eneli',
  // FWD
  'pulisic', 'weah', 'balogun', 'pepi', 'wright', 'sargent', 'zendejas',
  'ferreira', 'morris_j', 'vazquez', 'white', 'downs', 'agyemang', 'paredes',
])

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getFotmobUrl(player) {
  if (player.fotmobUrl) return player.fotmobUrl
  return `https://www.fotmob.com/search?query=${encodeURIComponent(player.name)}`
}

export default function PlayerCard({ player, selected, onToggle }) {
  const posClass = player.position.toLowerCase()
  const hasPhoto = PLAYERS_WITH_PHOTOS.has(player.id)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={`player-card ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(player.id)}
    >
      {hasPhoto && !imgError ? (
        <img
          className="player-avatar-img"
          src={`${import.meta.env.BASE_URL}players/${player.id}.jpg`}
          alt={player.name}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`player-avatar ${posClass}`}>
          {getInitials(player.name)}
        </div>
      )}
      <div className="player-name">{player.name}</div>
      <span className={`player-position-badge ${posClass}`}>
        {player.position}
      </span>
      <div className="player-club">{player.club}</div>
      <a
        href={getFotmobUrl(player)}
        className="player-fotmob-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        FotMob Profile
      </a>
    </div>
  )
}
