import { useState } from 'react'
import PlayerCard from './PlayerCard'
import { positionGroups } from '../data/players'

export default function PlayerPool({ players, selectedIds, onToggle }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = players.filter((p) => {
    if (filter !== 'ALL' && p.position !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="filter-bar">
        {Object.keys(positionGroups).map((key) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key === 'ALL' ? 'All' : key}
          </button>
        ))}
        <input
          type="text"
          className="search-input"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="player-grid" style={{ marginTop: '1rem' }}>
        {filtered.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            selected={selectedIds.has(player.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
