import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext.jsx'

function CollectionsPage() {
  const { collections, addCollection, deleteCollection, trips } = useTrips()
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (name.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (collections.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setError('A collection with that name already exists.')
      return
    }
    addCollection(name)
    setNewName('')
    setError('')
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Collections</h2>
          <p className="page-description">
            Organize your trips into named lists like "Europe 2024" or "Dream Trips".
          </p>
        </div>
      </header>

      <form className="collection-create-form card" onSubmit={handleCreate}>
        <label className="field-label" htmlFor="col-name">New collection</label>
        <div className="collection-create-row">
          <input
            id="col-name"
            className="input"
            placeholder='e.g. "Europe 2024" or "Dream Trips"'
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setError('') }}
          />
          <button type="submit" className="btn btn-primary">Create</button>
        </div>
        {error && <p className="form-error" style={{ marginTop: '8px' }}>{error}</p>}
      </form>

      {collections.length === 0 ? (
        <div className="empty-state">
          <h3>No collections yet</h3>
          <p>Create your first collection above to start organizing your trips.</p>
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map((col) => {
            const colTrips = trips.filter((t) => col.tripIds.includes(t.id))
            const preview = colTrips.find((t) => t.coverImage)
            return (
              <article key={col.id} className="collection-card">
                <Link to={`/collections/${col.id}`} className="collection-card-link">
                  <div className="collection-card-cover">
                    {preview ? (
                      <img src={preview.coverImage} alt={`Cover photo for ${col.name}`} className="collection-card-img" />
                    ) : (
                      <div className="collection-card-placeholder">No photos yet</div>
                    )}
                  </div>
                  <div className="collection-card-body">
                    <h3 className="collection-card-title">{col.name}</h3>
                    <span className="pill subtle">
                      {col.tripIds.length} trip{col.tripIds.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="collection-delete-btn"
                  onClick={() => deleteCollection(col.id)}
                  aria-label={`Delete ${col.name}`}
                >
                  ✕
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default CollectionsPage
