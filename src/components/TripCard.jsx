import { Link } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import { useTrips } from '../context/TripContext.jsx'

function TripCard({ trip }) {
  const { isBookmarked, toggleBookmark, getRating } = useTrips()
  const rating = getRating(trip.id)
  const bookmarked = isBookmarked(trip.id)

  return (
    <article className="trip-card">
      <div className="trip-card-image-wrapper">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="trip-card-image"
          />
        ) : (
          <div className="trip-card-placeholder">No photo</div>
        )}
        <button
          type="button"
          className={`bookmark-badge ${bookmarked ? 'bookmark-badge-active' : ''}`}
          onClick={() => toggleBookmark(trip.id)}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark trip'}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="trip-card-body">
        <div className="trip-card-meta">
          <span className="pill">{trip.country}</span>
          {rating && (
            <Badge bg="warning" text="dark" style={{ fontSize: '13px', padding: '5px 10px' }}>
              {'★'.repeat(rating)} {rating}/5
            </Badge>
          )}
        </div>
        <h3 className="trip-card-title">
          <Link to={`/trip/${trip.id}`}>{trip.title}</Link>
        </h3>
        <p className="trip-card-description">
          {trip.description.length > 140
            ? `${trip.description.slice(0, 140)}…`
            : trip.description}
        </p>
        {trip.itinerary?.length ? (
          <div className="trip-card-itinerary">
            <span className="pill subtle">
              {trip.itinerary.length} day
              {trip.itinerary.length > 1 ? 's' : ''} · Itinerary included
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default TripCard

