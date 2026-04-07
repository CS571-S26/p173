import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, ButtonGroup, Toast, ToastContainer } from 'react-bootstrap'
import { useTrips } from '../context/TripContext.jsx'

function formatDate(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(ts)
  } catch {
    return ''
  }
}

const STAR_LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']

function TripDetailPage() {
  const { id } = useParams()
  const { getTripById, isBookmarked, toggleBookmark, rateTrip, getRating } = useTrips()
  const [hovered, setHovered] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastRating, setToastRating] = useState(null)

  const trip = getTripById(id)
  const currentRating = trip ? getRating(trip.id) : null

  const handleRate = (stars) => {
    rateTrip(trip.id, stars)
    setToastRating(stars)
    setShowToast(true)
  }
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
        <h3 className="card-title">Rate this Trip</h3>
        <ButtonGroup>
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant={star <= (hovered ?? currentRating ?? 0) ? 'warning' : 'outline-secondary'}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRate(star)}
              style={{ fontSize: '20px', minWidth: '48px' }}
              aria-label={STAR_LABELS[star - 1]}
            >
              ★
            </Button>
          ))}
        </ButtonGroup>
        {currentRating && (
          <p className="card-text" style={{ marginTop: '10px' }}>
            Your rating: <strong>{STAR_LABELS[currentRating - 1]}</strong> ({currentRating}/5)
          </p>
        )}
      </section>

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

      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={2500} autohide bg="dark">
          <Toast.Body className="text-white">
            Rated <strong>{toastRating}/5</strong> — {toastRating ? STAR_LABELS[toastRating - 1] : ''}!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </section>
  )
}

export default TripDetailPage

