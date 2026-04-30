import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext.jsx'

function CollectionPicker({ tripId }) {
  const { collections, addCollection, addTripToCollection, removeTripFromCollection, getCollectionsForTrip } = useTrips()
  const [newName, setNewName] = useState('')
  const [showInput, setShowInput] = useState(false)

  const memberIds = new Set(getCollectionsForTrip(tripId).map((c) => c.id))

  const handleToggle = (colId) => {
    if (memberIds.has(colId)) {
      removeTripFromCollection(colId, tripId)
    } else {
      addTripToCollection(colId, tripId)
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (name.length < 2) return
    const newId = addCollection(name)
    addTripToCollection(newId, tripId)
    setNewName('')
    setShowInput(false)
  }

  return (
    <section className="card">
      <h3 className="card-title">Collections</h3>

      {collections.length === 0 && !showInput ? (
        <p className="card-text" style={{ marginBottom: '10px' }}>
          No collections yet.
        </p>
      ) : (
        <ul className="collection-picker-list">
          {collections.map((col) => {
            const active = memberIds.has(col.id)
            return (
              <li key={col.id}>
                <button
                  type="button"
                  className={`collection-picker-item ${active ? 'collection-picker-item-active' : ''}`}
                  onClick={() => handleToggle(col.id)}
                >
                  <span className="collection-picker-check">{active ? '✓' : '+'}</span>
                  <span className="collection-picker-name">{col.name}</span>
                  <span className="collection-picker-count">
                    {col.tripIds.length} trip{col.tripIds.length !== 1 ? 's' : ''}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {showInput ? (
        <form className="collection-inline-form" onSubmit={handleCreate}>
          <label className="field-label" htmlFor="collection-picker-input">
            New collection name
          </label>
          <input
            id="collection-picker-input"
            autoFocus
            className="input"
            placeholder='e.g. "Europe 2024"'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="collection-inline-actions">
            <button type="submit" className="btn btn-primary" disabled={newName.trim().length < 2}>
              Create &amp; add
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowInput(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-secondary" style={{ marginTop: '10px' }} onClick={() => setShowInput(true)}>
          + New collection
        </button>
      )}

      {collections.length > 0 && (
        <Link to="/collections" className="collection-picker-manage">
          Manage collections →
        </Link>
      )}
    </section>
  )
}

export default CollectionPicker
