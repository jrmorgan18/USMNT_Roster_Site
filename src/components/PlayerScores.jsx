function score(value) {
  return Number.isFinite(value) ? value.toFixed(1) : 'Unrated'
}
export default function PlayerScores({ player, compact = false }) {
  return <span className={`player-scores${compact ? ' player-scores--compact' : ''}`}>
    <span><small>Current</small><strong>{score(player.currentScore)}</strong></span>
    <span><small>2030</small><strong>{score(player.score2030)}</strong></span>
  </span>
}
