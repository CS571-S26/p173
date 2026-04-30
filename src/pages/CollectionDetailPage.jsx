import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext.jsx'
import TripCard from '../components/TripCard.jsx'

function CollectionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCollectionById, deleteCollection, trips, removeTripFromCollection } = useTrips()

  const collection = getCollectionById(id)

  if (!collection) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <h2>Collection not found</h2>
            <p className="page-description">This collection doesn't exist or was deleted.</p>
          </div>
        </header>
        <div className="card">
          <p>Go back to <Link to="/collections">Collections</Link>.</p>
        </div>
      </section>
    )
  }

  const colTrips = trips.filter((t) => collection.tripIds.includes(t.id))
  const totalDays = colTrips.reduce((sum, t) => sum + (t.itinerary?.length ?? 0), 0)
  const countries = new Set(colTrips.map((t) => t.country)).size

  const handleDelete = () => {
    deleteCollection(id)
    navigate('/collections')
  }

  return (
    <section className="page">
      <header className="page-header page-header-tight">
        <div className="page-header-row">
          <div>
            <div className="breadcrumbs">
              <Link to="/collections">Collections</Link>
              <span className="breadcrumbs-sep">/</span>
              <span>{collection.name}</span>
            </div>
            <h2>{collection.name}</h2>
            <p className="page-description">
              {collection.tripIds.length} trip{collection.tripIds.length !== 1 ? 's' : ''}
              {totalDays > 0 ? ` · ${totalDays} days` : ''}
              {countries > 0 ? ` · ${countries} countr${countries !== 1 ? 'ies' : 'y'}` : ''}
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleDelete}>
            Delete collection
          </button>
        </div>
      </header>

      {colTrips.length === 0 ? (
        <div className="empty-state">
          <h3>No trips here yet</h3>
          <p>Open any trip and use "Add to Collection" to add it here.</p>
        </div>
      ) : (
        <div className="trip-grid">
          {colTrips.map((trip) => (
            <div key={trip.id} className="collection-trip-wrapper">
              <TripCard trip={trip} />
              <button
                type="button"
                className="collection-remove-btn"
                onClick={() => removeTripFromCollection(id, trip.id)}
              >
                Remove from collection
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CollectionDetailPage
