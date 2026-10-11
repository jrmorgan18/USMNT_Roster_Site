import { players, boardSnapshot, boardUrl, articleUrl } from '../data/players'
const crestSrc = `${import.meta.env.BASE_URL}usmnt-crest.png`
export default function Header() {
  return <>
    <header className="header">
      <img className="header-crest" src={crestSrc} alt="USMNT crest" />
      <div className="header-text"><h1>USMNT Project 2030</h1><p>Roster selector</p></div>
      <img className="header-crest" src={crestSrc} alt="" />
    </header>
    <section className="board-context" aria-label="About the player pool">
      <p>Build your 26-player squad from all {players.length} Big Board players. Compare <strong>Current</strong> form with the <strong>2030</strong> projection.</p>
      <nav aria-label="Project 2030 links"><a href={boardUrl}>View the Big Board &rarr;</a><a href={articleUrl}>Read the October update &rarr;</a></nav>
      <small>Board scores updated {boardSnapshot} · Unrated players have no model score yet. Headshots via <a href="https://www.fotmob.com/" target="_blank" rel="noopener noreferrer">FotMob</a>.</small>
    </section>
  </>
}
