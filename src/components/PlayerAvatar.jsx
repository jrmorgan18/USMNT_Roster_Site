import { useState } from 'react'
export default function PlayerAvatar({ player, small = false }) {
  const [failed, setFailed] = useState(false)
  if (failed || !player.photo) return <span className={`${small ? 'mini-avatar' : 'player-avatar'} ${player.position.toLowerCase()}`}>
    {player.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
  </span>
  return <img className={small ? 'mini-avatar-img' : 'player-avatar-img'}
    src={`${import.meta.env.BASE_URL}${player.photo}`} alt={small ? '' : player.name}
    loading="lazy" onError={() => setFailed(true)} />
}
