import { useState } from 'react'
import FormationPicker from './FormationPicker'
import PitchView from './PitchView'
import { players } from '../data/players'
import { formations } from '../data/formations'
import { shareStartingXIToX, shareStartingXIToBluesky, shareStartingXIToDiscord } from '../utils/shareToX'

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Maps a formation slot role to a priority-ordered list of player positions
function getPositionOrder(role) {
  switch (role) {
    case 'GK':
      return ['GK', 'DEF', 'MID', 'FWD']
    case 'LB': case 'RB': case 'CB': case 'LWB': case 'RWB':
      return ['DEF', 'MID', 'FWD', 'GK']
    case 'CDM': case 'CM':
      return ['MID', 'DEF', 'FWD', 'GK']
    case 'CAM': case 'LM': case 'RM':
      return ['MID', 'FWD', 'DEF', 'GK']
    case 'LW': case 'RW': case 'ST':
      return ['FWD', 'MID', 'DEF', 'GK']
    default:
      return ['GK', 'DEF', 'MID', 'FWD']
  }
}

export default function StartingXI({ selectedIds, startingXI, setStartingXI, formation, setFormation }) {
  const [pickerSlot, setPickerSlot] = useState(null)
  const [copied, setCopied] = useState(false)

  const rosterPlayers = players.filter((p) => selectedIds.has(p.id))
  const xiPlayerIds = new Set(
    startingXI.filter(Boolean).map((p) => p.id)
  )

  if (selectedIds.size === 0) {
    return (
      <div className="empty-state">
        <p>No roster selected yet</p>
        <span className="hint">
          Go to the Roster Builder tab to select your 26-man squad first.
        </span>
      </div>
    )
  }

  const handleFormationChange = (newFormation) => {
    setFormation(newFormation)
    setStartingXI(new Array(11).fill(null))
  }

  const handleSlotClick = (idx) => {
    setPickerSlot(idx)
  }

  const handlePickPlayer = (player) => {
    const newXI = [...startingXI]
    // Remove player from any other slot first
    const existingIdx = newXI.findIndex((p) => p && p.id === player.id)
    if (existingIdx !== -1) {
      newXI[existingIdx] = null
    }
    newXI[pickerSlot] = player
    setStartingXI(newXI)
    setPickerSlot(null)
  }

  const handleClearSlot = () => {
    const newXI = [...startingXI]
    newXI[pickerSlot] = null
    setStartingXI(newXI)
    setPickerSlot(null)
  }

  const grouped = {
    GK: rosterPlayers.filter((p) => p.position === 'GK'),
    DEF: rosterPlayers.filter((p) => p.position === 'DEF'),
    MID: rosterPlayers.filter((p) => p.position === 'MID'),
    FWD: rosterPlayers.filter((p) => p.position === 'FWD'),
  }

  const benchPlayers = rosterPlayers.filter((p) => !xiPlayerIds.has(p.id))

  return (
    <div className="starting-xi">
      <div className="pitch-section">
        <div className="pitch-toolbar">
          <FormationPicker formation={formation} onChange={handleFormationChange} />
          {startingXI.some(Boolean) && (
            <div className="share-buttons">
              <button
                className="share-btn"
                onClick={() => shareStartingXIToX(formation, startingXI, formations[formation].positions)}
                title="Share Starting XI to X"
              >
                Share to &#120143;
              </button>
              <button
                className="share-btn bluesky"
                onClick={() => shareStartingXIToBluesky(formation, startingXI, formations[formation].positions)}
                title="Share Starting XI to Bluesky"
              >
                Share to Bluesky
              </button>
              <button
                className="share-btn discord"
                onClick={async () => {
                  const ok = await shareStartingXIToDiscord(formation, startingXI, formations[formation].positions)
                  if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
                }}
                title="Copy Starting XI for Discord"
              >
                {copied ? 'Copied!' : 'Copy for Discord'}
              </button>
            </div>
          )}
        </div>
        <PitchView
          formation={formation}
          startingXI={startingXI}
          onSlotClick={handleSlotClick}
        />
      </div>

      <div className="roster-sidebar">
        <h3>Starting XI</h3>
        {Object.entries(grouped).map(([pos, list]) =>
          list.length > 0 ? (
            <div key={pos} className="sidebar-group">
              <h4>{pos}</h4>
              {list.map((p) => (
                <div
                  key={p.id}
                  className={`sidebar-player ${xiPlayerIds.has(p.id) ? 'in-xi' : ''}`}
                >
                  <div className={`mini-avatar ${p.position.toLowerCase()}`}>
                    {getInitials(p.name)}
                  </div>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          ) : null
        )}

        {benchPlayers.length > 0 && (
          <div className="bench-section">
            <h4>Bench ({benchPlayers.length})</h4>
            {benchPlayers.map((p) => (
              <div key={p.id} className="sidebar-player">
                <div className={`mini-avatar ${p.position.toLowerCase()}`}>
                  {getInitials(p.name)}
                </div>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Picker Modal */}
      {pickerSlot !== null && (
        <div className="modal-overlay" onClick={() => setPickerSlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              Select player for{' '}
              {formations[formation].positions[pickerSlot].label}
            </h3>
            {getPositionOrder(formations[formation].positions[pickerSlot].role).map((pos) =>
              grouped[pos] && grouped[pos].length > 0 ? (
                <div key={pos}>
                  <h4 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0.3rem', textTransform: 'uppercase' }}>
                    {pos}
                  </h4>
                  {grouped[pos].map((p) => (
                    <button
                      key={p.id}
                      className={`modal-player-btn ${xiPlayerIds.has(p.id) && startingXI[pickerSlot]?.id !== p.id ? 'in-xi' : ''}`}
                      onClick={() => handlePickPlayer(p)}
                    >
                      <div
                        className={`mini-avatar ${p.position.toLowerCase()}`}
                        style={{ width: 24, height: 24, fontSize: '0.55rem' }}
                      >
                        {getInitials(p.name)}
                      </div>
                      {p.name}
                    </button>
                  ))}
                </div>
              ) : null
            )}
            {startingXI[pickerSlot] && (
              <button className="modal-clear-btn" onClick={handleClearSlot}>
                Clear Position
              </button>
            )}
            <button className="modal-close" onClick={() => setPickerSlot(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
