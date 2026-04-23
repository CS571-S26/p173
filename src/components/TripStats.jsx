import { useMemo } from 'react'
import { useTrips } from '../context/TripContext.jsx'

function TripStats() {
  const { trips, getRating } = useTrips()

  const stats = useMemo(() => {
    const countries = new Set(trips.map((t) => t.country.trim().toLowerCase()))
    const rated = trips.filter((t) => getRating(t.id) !== null)
    const avgRating =
      rated.length > 0
        ? (rated.reduce((sum, t) => sum + getRating(t.id), 0) / rated.length).toFixed(1)
        : null
    return { total: trips.length, countries: countries.size, avgRating, ratedCount: rated.length }
  }, [trips, getRating])

  return (
    <div className="trip-stats">
      <div className="stat-item">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Trips</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">{stats.countries}</span>
        <span className="stat-label">Countries</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">
          {stats.avgRating ? `★ ${stats.avgRating}` : '—'}
        </span>
        <span className="stat-label">
          {stats.ratedCount > 0 ? `Avg rating (${stats.ratedCount} rated)` : 'No ratings yet'}
        </span>
      </div>
    </div>
  )
}

export default TripStats
