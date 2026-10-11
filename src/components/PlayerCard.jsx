import PlayerAvatar from './PlayerAvatar'
import PlayerScores from './PlayerScores'
export default function PlayerCard({ player, selected, onToggle }) {
  const fotmobUrl = player.fotmobUrl || `https://www.fotmob.com/search?query=${encodeURIComponent(player.name)}`
  return <div className={`player-card ${selected ? 'selected' : ''}`} data-player={player.profile}>
    <button type="button" className="player-card-toggle" aria-pressed={selected}
      aria-label={`${selected ? 'Remove' : 'Select'} ${player.name}`} onClick={() => onToggle(player.id)}>
      <span className="player-board-rank">{player.rank ? `No. ${player.rank}` : 'Unranked'}</span>
      <PlayerAvatar player={player} />
      <span className="player-name">{player.name}</span>
      <span className={`player-position-badge ${player.position.toLowerCase()}`}>{player.boardPosition}</span>
      <span className="player-club">{player.club}</span>
      <span className="player-league">{player.league}</span>
      <PlayerScores player={player} />
    </button>
    <a href={fotmobUrl} className="player-fotmob-link" target="_blank" rel="noopener noreferrer">FotMob profile</a>
  </div>
}
