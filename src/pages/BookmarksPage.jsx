import TripCard from '../components/TripCard.jsx'
import { useTrips } from '../context/TripContext.jsx'

function BookmarksPage() {
  const { bookmarkedTrips } = useTrips()

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Bookmarks</h2>
          <p className="page-description">
            Your saved trips. Remove a bookmark using the star on any card.
          </p>
        </div>
      </header>

      {bookmarkedTrips.length === 0 ? (
        <div className="empty-state">
          <h3>No bookmarks yet</h3>
          <p>Bookmark trips from the feed to see them here.</p>
        </div>
      ) : (
        <div className="trip-grid">
          {bookmarkedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookmarksPage

