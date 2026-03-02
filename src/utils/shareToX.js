// ===== Shared helpers =====

function buildRosterText(selectedPlayers, { prefix, bold }) {
  const grouped = {
    GK: selectedPlayers.filter((p) => p.position === 'GK'),
    DEF: selectedPlayers.filter((p) => p.position === 'DEF'),
    MID: selectedPlayers.filter((p) => p.position === 'MID'),
    FWD: selectedPlayers.filter((p) => p.position === 'FWD'),
  }
  const lastName = (name) => name.split(' ').pop()
  const name = bold ? (p) => p.name : (p) => lastName(p.name)
  const label = bold ? (l) => `**${l}:**` : (l) => `${l}:`

  const lines = [prefix]
  for (const [pos, list] of Object.entries(grouped)) {
    if (list.length > 0) {
      lines.push(`${label(pos)} ${list.map(name).join(', ')}`)
    }
  }
  return lines.join('\n')
}

// Build a text formation diagram from the position coordinates.
// Groups players into rows by similar y-values (sorted top to bottom,
// i.e. attackers first), then spaces names across each row using x-values.
function buildFormationText(formation, startingXI, formationPositions) {
  const filledCount = startingXI.filter(Boolean).length
  if (filledCount === 0) return null

  const lastName = (name) => name.split(' ').pop()

  // Pair each filled slot with its position data
  const slots = []
  startingXI.forEach((player, i) => {
    if (!player) return
    slots.push({ name: lastName(player.name), x: formationPositions[i].x, y: formationPositions[i].y })
  })

  // Group by similar y-values (within 8 units = same row)
  slots.sort((a, b) => a.y - b.y)
  const rows = []
  for (const slot of slots) {
    const lastRow = rows[rows.length - 1]
    if (lastRow && Math.abs(slot.y - lastRow[0].y) < 8) {
      lastRow.push(slot)
    } else {
      rows.push([slot])
    }
  }

  // Reverse so attackers are at the top
  rows.reverse()

  // Render each row: space names based on x-position across a fixed width
  const WIDTH = 36
  const lines = [`My USMNT Starting XI (${formation}):\n`]

  for (const row of rows) {
    row.sort((a, b) => a.x - b.x)

    if (row.length === 1) {
      // Center the single name
      const padded = row[0].name.padStart(Math.floor((WIDTH + row[0].name.length) / 2))
      lines.push(padded)
    } else {
      // Distribute names across the width based on x-positions
      // Map x (0-100) to character columns (0 to WIDTH)
      const positioned = row.map((s) => ({
        name: s.name,
        col: Math.round((s.x / 100) * WIDTH),
      }))

      let line = ''
      for (const p of positioned) {
        const targetCol = Math.max(p.col - Math.floor(p.name.length / 2), line.length)
        line += ' '.repeat(Math.max(0, targetCol - line.length))
        line += p.name
      }
      lines.push(line)
    }
  }

  return lines.join('\n')
}

// ===== X / Twitter =====

export function shareRosterToX(selectedPlayers) {
  const text = buildRosterText(selectedPlayers, {
    prefix: 'My USMNT 2026 World Cup 26-Man Roster:\n',
    bold: false,
  })
  openTwitterIntent(text)
}

export function shareStartingXIToX(formation, startingXI, formationPositions) {
  const text = buildFormationText(formation, startingXI, formationPositions)
  if (!text) return
  openTwitterIntent(text)
}

function openTwitterIntent(text) {
  const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
}

// ===== Bluesky =====

export function shareRosterToBluesky(selectedPlayers) {
  const text = buildRosterText(selectedPlayers, {
    prefix: 'My USMNT 2026 World Cup 26-Man Roster:\n',
    bold: false,
  })
  openBlueskyIntent(text)
}

export function shareStartingXIToBluesky(formation, startingXI, formationPositions) {
  const text = buildFormationText(formation, startingXI, formationPositions)
  if (!text) return
  openBlueskyIntent(text)
}

function openBlueskyIntent(text) {
  const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
}

// ===== Discord (copy formatted text to clipboard) =====

export async function shareRosterToDiscord(selectedPlayers) {
  const text = buildRosterText(selectedPlayers, {
    prefix: '## :us: My USMNT 2026 World Cup 26-Man Roster\n',
    bold: true,
  })
  return copyToClipboard(text)
}

export async function shareStartingXIToDiscord(formation, startingXI, formationPositions) {
  const text = buildFormationText(formation, startingXI, formationPositions)
  if (!text) return false
  // Wrap in a code block so Discord preserves the spacing
  const discord = `## :us: My USMNT Starting XI\n\`\`\`\n${text}\n\`\`\``
  return copyToClipboard(discord)
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
