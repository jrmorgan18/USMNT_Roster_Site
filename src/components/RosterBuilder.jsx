import { useState } from 'react'
import PlayerPool from './PlayerPool'
import { players } from '../data/players'
import { shareRosterToX, shareRosterToBluesky, shareRosterToDiscord } from '../utils/shareToX'

const MAX_ROSTER = 26

export default function RosterBuilder({ selectedIds, onToggle }) {
  const [copied, setCopied] = useState(false)
  const selectedPlayers = players.filter((p) => selectedIds.has(p.id))
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
  selectedPlayers.forEach((p) => counts[p.position]++)

  const grouped = {
    GK: selectedPlayers.filter((p) => p.position === 'GK'),
    DEF: selectedPlayers.filter((p) => p.position === 'DEF'),
    MID: selectedPlayers.filter((p) => p.position === 'MID'),
    FWD: selectedPlayers.filter((p) => p.position === 'FWD'),
  }

  const handleToggle = (id) => {
    if (!selectedIds.has(id) && selectedIds.size >= MAX_ROSTER) return
    onToggle(id)
  }

  return (
    <div className="roster-builder">
      <div className="roster-counter">
        <div className="count-main">
          <span className="current">{selectedIds.size}</span> / {MAX_ROSTER} Selected
        </div>
        <div className="position-counts">
          <span className="pos-count gk">GK: {counts.GK}</span>
          <span className="pos-count def">DEF: {counts.DEF}</span>
          <span className="pos-count mid">MID: {counts.MID}</span>
          <span className="pos-count fwd">FWD: {counts.FWD}</span>
        </div>
        {selectedIds.size > 0 && (
          <div className="share-buttons">
            <button
              className="share-btn"
              onClick={() => shareRosterToX(selectedPlayers)}
              title="Share roster to X"
            >
              Share to &#120143;
            </button>
            <button
              className="share-btn bluesky"
              onClick={() => shareRosterToBluesky(selectedPlayers)}
              title="Share roster to Bluesky"
            >
              Share to Bluesky
            </button>
            <button
              className="share-btn discord"
              onClick={async () => {
                const ok = await shareRosterToDiscord(selectedPlayers)
                if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
              }}
              title="Copy roster for Discord"
            >
              {copied ? 'Copied!' : 'Copy for Discord'}
            </button>
          </div>
        )}
      </div>

      <PlayerPool
        players={players}
        selectedIds={selectedIds}
        onToggle={handleToggle}
      />

      {selectedPlayers.length > 0 && (
        <div className="selected-section">
          <h3>Your Roster</h3>
          {Object.entries(grouped).map(
            ([pos, list]) =>
              list.length > 0 && (
                <div key={pos} className="selected-group">
                  <h4>{pos} ({list.length})</h4>
                  <div className="selected-list">
                    {list.map((p) => (
                      <span key={p.id} className="selected-chip">
                        {p.name}
                        <button
                          className="remove-btn"
                          onClick={() => onToggle(p.id)}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  )
}
