import { useMemo, useState } from 'react'
import { useTrips } from '../context/TripContext.jsx'
import TripCard from '../components/TripCard.jsx'
import TripStats from '../components/TripStats.jsx'
import SortBar from '../components/SortBar.jsx'
import MapView from '../components/MapView.jsx'

function FeedPage() {
  const { trips, getRating } = useTrips()
  const [countryQuery, setCountryQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')

  const filteredTrips = useMemo(() => {
    const query = countryQuery.trim().toLowerCase()
    const filtered = query
      ? trips.filter((trip) => trip.country.toLowerCase().includes(query))
      : [...trips]

    if (sort === 'newest') {
      filtered.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (getRating(b.id) ?? 0) - (getRating(a.id) ?? 0))
    } else if (sort === 'country') {
      filtered.sort((a, b) => a.country.localeCompare(b.country))
    }

    return filtered
  }, [trips, countryQuery, sort, getRating])

  const handleSelectCountry = (country) => {
    setCountryQuery(country)
    setView('grid')
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Trip Feed</h2>
          <p className="page-description">
            Browse trips from around the world. Search by country to get
            inspired for your next adventure.
          </p>
          <div className="search-group" style={{ marginTop: '12px' }}>
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
        </div>
        <div className="view-toggle">
          <button
            type="button"
            className={`sort-btn ${view === 'grid' ? 'sort-btn-active' : ''}`}
            onClick={() => setView('grid')}
          >
            ⊞ Grid
          </button>
          <button
            type="button"
            className={`sort-btn ${view === 'map' ? 'sort-btn-active' : ''}`}
            onClick={() => setView('map')}
          >
            ◎ Map
          </button>
        </div>
      </header>

      <TripStats />

      {view === 'map' ? (
        <div className="map-container card">
          <p className="map-hint">Click a pin to filter trips by country.</p>
          <MapView onSelectCountry={handleSelectCountry} />
        </div>
      ) : (
        <>
          <SortBar sort={sort} onSort={setSort} />
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
        </>
      )}
    </section>
  )
}

export default FeedPage
