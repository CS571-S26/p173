import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TripContext = createContext(null)

const STORAGE_KEY = 'trip-rater-trips-v1'
const BOOKMARKS_KEY = 'trip-rater-bookmarks-v1'
const RATINGS_KEY = 'trip-rater-ratings-v1'

const seedTrips = [
  {
    id: 'sample-1',
    title: 'Summer in Santorini',
    country: 'Greece',
    coverImage:
      'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Three dreamy days exploring whitewashed villages, sunsets in Oia, and beaches along the Aegean Sea.',
    itinerary: [
      {
        day: 1,
        title: 'Oia & Sunset',
        activities:
          'Arrive in Santorini, check into cave hotel in Oia, wander narrow alleys, sunset at Oia Castle viewpoint.',
      },
      {
        day: 2,
        title: 'Beaches & Wine',
        activities:
          'Visit Red Beach and Perissa Beach, swim and relax, afternoon wine tasting at a cliffside winery.',
      },
      {
        day: 3,
        title: 'Fira & Caldera Views',
        activities:
          'Bus to Fira, walk caldera trail, souvenir shopping, farewell dinner with caldera view.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'sample-2',
    title: 'Tokyo City Lights',
    country: 'Japan',
    coverImage:
      'https://images.pexels.com/photos/373290/pexels-photo-373290.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A whirlwind long weekend of ramen, neon alleys, and tranquil shrines in the heart of Tokyo.',
    itinerary: [
      {
        day: 1,
        title: 'Shibuya & Shinjuku',
        activities:
          'Shibuya Crossing, Hachiko statue, shopping in Shibuya, Golden Gai bar hopping in Shinjuku.',
      },
      {
        day: 2,
        title: 'Asakusa & Akihabara',
        activities:
          'Senso-ji Temple in Asakusa, street snacks, anime and retro gaming arcades in Akihabara.',
      },
      {
        day: 3,
        title: 'Meiji Shrine & Harajuku',
        activities:
          'Morning at Meiji Shrine, Takeshita Street fashion spotting, Omotesando cafes.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
]

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() =>
    loadFromStorage(STORAGE_KEY, seedTrips)
  )
  const [bookmarkedIds, setBookmarkedIds] = useState(() =>
    loadFromStorage(BOOKMARKS_KEY, [])
  )
  const [ratings, setRatings] = useState(() =>
    loadFromStorage(RATINGS_KEY, {})
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds))
  }, [bookmarkedIds])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
  }, [ratings])

  const addTrip = (trip) => {
    setTrips((prev) => [
      {
        ...trip,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    )
  }

  const isBookmarked = (id) => bookmarkedIds.includes(id)

  const getTripById = (id) => trips.find((t) => t.id === id)

  const bookmarkedTrips = useMemo(
    () => trips.filter((t) => bookmarkedIds.includes(t.id)),
    [trips, bookmarkedIds]
  )

  const rateTrip = (id, stars) => {
    setRatings((prev) => ({ ...prev, [id]: stars }))
  }

  const getRating = (id) => ratings[id] ?? null

  const value = {
    trips,
    addTrip,
    toggleBookmark,
    isBookmarked,
    getTripById,
    bookmarkedTrips,
    rateTrip,
    getRating,
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) {
    throw new Error('useTrips must be used within TripProvider')
  }
  return ctx
}

