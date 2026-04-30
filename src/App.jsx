import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import FeedPage from './pages/FeedPage.jsx'
import TripDetailPage from './pages/TripDetailPage.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import BookmarksPage from './pages/BookmarksPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import CollectionDetailPage from './pages/CollectionDetailPage.jsx'
import './App.css'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">✈️</span>
          <div>
            <h1 className="brand-title">Trip Rater</h1>
            <p className="brand-subtitle">Capture. Rate. Remember.</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            New Trip
          </NavLink>
          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Bookmarks
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Collections
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/trip/:id" element={<TripDetailPage />} />
          <Route path="/create" element={<CreateTripPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>Trip Rater · Built with React &amp; Vite</span>
      </footer>
    </div>
  )
}

export default App
