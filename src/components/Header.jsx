const crestSrc = `${import.meta.env.BASE_URL}usmnt-crest.png`

export default function Header() {
  return (
    <header className="header">
      <img className="header-crest" src={crestSrc} alt="USMNT Crest" />
      <div className="header-text">
        <h1>USMNT 2026 World Cup</h1>
        <p>Roster Picker</p>
      </div>
      <img className="header-crest" src={crestSrc} alt="USMNT Crest" />
    </header>
  )
}
