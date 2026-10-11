import { useState } from 'react'
import PlayerCard from './PlayerCard'
import { positionGroups } from '../data/players'

export default function PlayerPool({ players, selectedIds, onToggle }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('currentScore')

  const filtered = players.filter((p) => {
    if (filter !== 'ALL' && p.position !== filter) return false
    if (search && ![p.name, p.club, p.league].join(' ').toLowerCase().includes(search.trim().toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    return (b[sort] ?? -Infinity) - (a[sort] ?? -Infinity) || (a.rank ?? 999) - (b.rank ?? 999)
  })

  return (
    <div>
      <div className="filter-bar">
        {Object.keys(positionGroups).map((key) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            aria-pressed={filter === key}
            aria-label={positionGroups[key]}
            onClick={() => setFilter(key)}
          >
            {key === 'ALL' ? 'All' : key}
          </button>
        ))}
        <input
          type="text"
          className="search-input"
          placeholder="Player, club or league"
          aria-label="Search players, clubs or leagues"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="sort-label">Sort by
          <select aria-label="Sort players" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="currentScore">Current score</option><option value="score2030">2030 score</option><option value="name">Name</option>
          </select>
        </label>
      </div>
      <p className="pool-count" aria-live="polite">{filtered.length} of {players.length} players</p>
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
