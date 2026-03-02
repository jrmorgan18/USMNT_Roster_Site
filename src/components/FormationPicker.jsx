import { formations } from '../data/formations'

export default function FormationPicker({ formation, onChange }) {
  return (
    <div className="formation-picker">
      <label htmlFor="formation-select">Formation:</label>
      <select
        id="formation-select"
        className="formation-select"
        value={formation}
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.keys(formations).map((key) => (
          <option key={key} value={key}>
            {formations[key].label}
          </option>
        ))}
      </select>
    </div>
  )
}
