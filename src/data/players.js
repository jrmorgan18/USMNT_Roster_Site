import board from './big-board.json'
import portraits from './player-portraits.json'
const positions = { GK: 'GK', CB: 'DEF', FB: 'DEF', FBW: 'DEF', DM: 'MID', CM: 'MID', AM: 'MID', W: 'FWD', ST: 'FWD' }
export const boardSnapshot = board.updated_on
export const boardUrl = 'https://dualeights.com/soccer/project-2030/big-board/'
export const articleUrl = 'https://dualeights.com/soccer/project-2030/big-board-october-2026-update/'
// Exact published pool and scores; retain IDs for existing saved squads.
export const players = board.players.map(player => ({
  ...portraits[player.profile], profile: player.profile, name: player.name,
  position: positions[player.position], boardPosition: player.position,
  club: player.club, league: player.league, rank: player.rank,
  currentScore: player.current_score, score2030: player.score_2030, number: null,
}))
export const positionGroups = { ALL: 'All positions', GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards' }
