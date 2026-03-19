import { useMemo, useState } from 'react'
import { useTrips } from '../context/TripContext.jsx'
import TripCard from '../components/TripCard.jsx'

function FeedPage() {
  const { trips } = useTrips()
  const [countryQuery, setCountryQuery] = useState('')

  const filteredTrips = useMemo(() => {
    const query = countryQuery.trim().toLowerCase()
    if (!query) return trips
    return trips.filter((trip) =>
      trip.country.toLowerCase().includes(query.toLowerCase())
    )
  }, [trips, countryQuery])

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Trip Feed</h2>
          <p className="page-description">
            Browse trips from around the world. Search by country to get
            inspired for your next adventure.
          </p>
        </div>
        <div className="search-group">
          <label className="field-label" htmlFor="country-search">
            Search by country
          </label>
          <input
            id="country-search"
            type="text"
            className="input"
            placeholder="e.g. Japan, Greece, Canada..."
            value={countryQuery}
            onChange={(e) => setCountryQuery(e.target.value)}
          />
        </div>
      </header>

      {filteredTrips.length === 0 ? (
        <div className="empty-state">
          <h3>No trips found</h3>
          <p>
            Try a different country name, or{' '}
            <span className="highlight">create your first trip</span>.
          </p>
        </div>
      ) : (
        <div className="trip-grid">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FeedPage

