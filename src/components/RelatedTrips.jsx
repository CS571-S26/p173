import { useMemo } from 'react'
import { useTrips } from '../context/TripContext.jsx'
import TripCard from './TripCard.jsx'

function RelatedTrips({ currentId, country }) {
  const { trips } = useTrips()

  const related = useMemo(() =>
    trips
      .filter((t) => t.id !== currentId && t.country.toLowerCase() === country.toLowerCase())
      .slice(0, 3),
    [trips, currentId, country]
  )

  if (related.length === 0) return null

  return (
    <section className="card">
      <h3 className="card-title">More trips in {country}</h3>
      <div className="related-grid">
        {related.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  )
}

export default RelatedTrips
