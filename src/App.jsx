import { useState, useEffect } from 'react'
import Header from './components/Header'
import RosterBuilder from './components/RosterBuilder'
import StartingXI from './components/StartingXI'
import { players } from './data/players'
import './App.css'

const STORAGE_KEY = 'usmnt-roster-picker'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    const validIds = new Set(players.map((p) => p.id))

    const selectedIds = new Set(
      (data.selectedIds || []).filter((id) => validIds.has(id))
    )

    const startingXI = (data.startingXI || new Array(11).fill(null)).map(
      (entry) => {
        if (!entry) return null
        const player = players.find((p) => p.id === entry.id)
        return player && selectedIds.has(player.id) ? player : null
      }
    )

    const formation = data.formation || '4-3-3'

    return { selectedIds, startingXI, formation }
  } catch {
    return null
  }
}

function save(selectedIds, startingXI, formation) {
  const data = {
    selectedIds: [...selectedIds],
    startingXI: startingXI.map((p) => (p ? { id: p.id } : null)),
    formation,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function App() {
  const [tab, setTab] = useState('roster')

  const saved = loadSaved()
  const [selectedIds, setSelectedIds] = useState(saved?.selectedIds || new Set())
  const [startingXI, setStartingXI] = useState(saved?.startingXI || new Array(11).fill(null))
  const [formation, setFormation] = useState(saved?.formation || '4-3-3')

  useEffect(() => {
    save(selectedIds, startingXI, formation)
  }, [selectedIds, startingXI, formation])

  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setStartingXI((xi) =>
          xi.map((p) => (p && p.id === id ? null : p))
        )
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="app">
      <Header />
      <nav className="tab-nav">
        <button
          className={`tab-btn ${tab === 'roster' ? 'active' : ''}`}
          onClick={() => setTab('roster')}
        >
          Roster Builder
        </button>
        <button
          className={`tab-btn ${tab === 'xi' ? 'active' : ''}`}
          onClick={() => setTab('xi')}
        >
          Starting XI
        </button>
      </nav>
      <main className="main-content">
        {tab === 'roster' ? (
          <RosterBuilder selectedIds={selectedIds} onToggle={handleToggle} />
        ) : (
          <StartingXI
            selectedIds={selectedIds}
            startingXI={startingXI}
            setStartingXI={setStartingXI}
            formation={formation}
            setFormation={setFormation}
          />
        )}
      </main>
    </div>
  )
}
