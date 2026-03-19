import { Link, useParams } from 'react-router-dom'
import { useTrips } from '../context/TripContext.jsx'

function formatDate(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(ts)
  } catch {
    return ''
  }
}

function TripDetailPage() {
  const { id } = useParams()
  const { getTripById, isBookmarked, toggleBookmark } = useTrips()

  const trip = getTripById(id)
  if (!trip) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <h2>Trip not found</h2>
            <p className="page-description">
              This trip doesn’t exist (or was removed).
            </p>
          </div>
        </header>
        <div className="card">
          <p>
            Go back to the <Link to="/">feed</Link>.
          </p>
        </div>
      </section>
    )
  }

  const bookmarked = isBookmarked(trip.id)
  const photos = [
    ...(trip.coverImage ? [trip.coverImage] : []),
    ...(trip.photos || []),
  ].filter(Boolean)

  return (
    <section className="page">
      <header className="page-header page-header-tight">
        <div className="page-header-row">
          <div>
            <div className="breadcrumbs">
              <Link to="/">Feed</Link>
              <span className="breadcrumbs-sep">/</span>
              <span>{trip.country}</span>
            </div>
            <h2>{trip.title}</h2>
            <p className="page-description">
              {trip.country}
              {trip.createdAt ? ` · ${formatDate(trip.createdAt)}` : ''}
            </p>
          </div>
          <button
            type="button"
            className={bookmarked ? 'btn btn-secondary' : 'btn btn-primary'}
            onClick={() => toggleBookmark(trip.id)}
          >
            {bookmarked ? 'Remove bookmark' : 'Bookmark'}
          </button>
        </div>
      </header>

      {photos.length ? (
        <div className="gallery">
          {photos.map((src, idx) => (
            <img
              key={`${src}-${idx}`}
              src={src}
              alt={`${trip.title} photo ${idx + 1}`}
              className={idx === 0 ? 'gallery-hero' : 'gallery-thumb'}
            />
          ))}
        </div>
      ) : null}

      <div className="grid-two">
        <section className="card">
          <h3 className="card-title">Description</h3>
          <p className="card-text">{trip.description || 'No description yet.'}</p>
        </section>
        <section className="card">
          <h3 className="card-title">Quick facts</h3>
          <div className="facts">
            <div className="fact">
              <span className="fact-label">Country</span>
              <span className="fact-value">{trip.country}</span>
            </div>
            <div className="fact">
              <span className="fact-label">Days</span>
              <span className="fact-value">{trip.itinerary?.length || 0}</span>
            </div>
            <div className="fact">
              <span className="fact-label">Photos</span>
              <span className="fact-value">{photos.length}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="card">
        <h3 className="card-title">Itinerary</h3>
        {trip.itinerary?.length ? (
          <ol className="itinerary">
            {trip.itinerary.map((item) => (
              <li key={item.day} className="itinerary-item">
                <div className="itinerary-day">Day {item.day}</div>
                <div className="itinerary-body">
                  <div className="itinerary-title">{item.title}</div>
                  <div className="itinerary-activities">{item.activities}</div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="card-text">No day-by-day itinerary yet.</p>
        )}
      </section>
    </section>
  )
}

export default TripDetailPage

