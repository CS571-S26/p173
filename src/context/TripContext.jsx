import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TripContext = createContext(null)

const STORAGE_KEY = 'trip-rater-trips-v1'
const BOOKMARKS_KEY = 'trip-rater-bookmarks-v1'
const RATINGS_KEY = 'trip-rater-ratings-v1'
const COLLECTIONS_KEY = 'trip-rater-collections-v1'

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
  {
    id: 'sample-3',
    title: 'Patagonia Trek',
    country: 'Argentina',
    coverImage:
      'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Five days of raw wilderness — glaciers, granite peaks, and unforgettable hikes through Torres del Paine.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in El Calafate',
        activities: 'Fly into El Calafate, rest up, gear check, and a hearty lamb stew dinner.',
      },
      {
        day: 2,
        title: 'Perito Moreno Glacier',
        activities: 'Full-day guided ice trek on Perito Moreno, watch massive calving events up close.',
      },
      {
        day: 3,
        title: 'W Trek — Base Las Torres',
        activities: 'Bus to Torres del Paine, hike to the base of the iconic granite towers, camp overnight.',
      },
      {
        day: 4,
        title: 'Valle del Francés',
        activities: 'Hike the French Valley, spot condors soaring above the hanging glaciers.',
      },
      {
        day: 5,
        title: 'Lago Grey & Departure',
        activities: 'Morning kayak on Grey Lake alongside icebergs, afternoon transfer back to Punta Arenas.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: 'sample-4',
    title: 'Kyoto in Autumn',
    country: 'Japan',
    coverImage:
      'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Maple-lined temple paths, matcha everything, and the most serene ryokan stay imaginable during peak fall foliage.',
    itinerary: [
      {
        day: 1,
        title: 'Arashiyama',
        activities: 'Bamboo grove at dawn, boat ride on the Oi River, Tenryu-ji garden, and tofu kaiseki lunch.',
      },
      {
        day: 2,
        title: 'Fushimi Inari & Gion',
        activities: 'Hike the thousand torii gates early morning, explore Gion district at dusk for geisha spotting.',
      },
      {
        day: 3,
        title: 'Higashiyama & Nishiki',
        activities: 'Kiyomizudera temple, stone-paved Ninenzaka lane, Nishiki Market street food crawl.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
  },
  {
    id: 'sample-5',
    title: 'Amalfi Coast Drive',
    country: 'Italy',
    coverImage:
      'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Cliffside villages, turquoise coves, limoncello, and pasta so fresh it ruins everything else forever.',
    itinerary: [
      {
        day: 1,
        title: 'Positano',
        activities: 'Arrive in Positano, swim at Spiaggia Grande, fresh seafood at a cliffside trattoria.',
      },
      {
        day: 2,
        title: 'Ravello & Amalfi Town',
        activities: 'Villa Rufolo gardens in Ravello, visit Amalfi Cathedral, lemon grove tour and limoncello tasting.',
      },
      {
        day: 3,
        title: 'Path of the Gods Hike',
        activities: 'Hike the Sentiero degli Dei with panoramic coastal views, end in Nocelle, bus back to Positano.',
      },
      {
        day: 4,
        title: 'Capri Day Trip',
        activities: 'Ferry to Capri, Blue Grotto boat tour, chairlift to Monte Solaro, gelato on the piazzetta.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'sample-6',
    title: 'Moroccan Desert & Medinas',
    country: 'Morocco',
    coverImage:
      'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'From the labyrinthine souks of Marrakech to sleeping under a billion stars in the Sahara dunes.',
    itinerary: [
      {
        day: 1,
        title: 'Marrakech Medina',
        activities: 'Djemaa el-Fna square at night, explore souks, mint tea ceremony, dinner in a riad.',
      },
      {
        day: 2,
        title: 'Jardin Majorelle & Palaces',
        activities: 'Yves Saint Laurent\'s Majorelle Garden, Bahia Palace, hammam spa afternoon.',
      },
      {
        day: 3,
        title: 'Drive to Merzouga',
        activities: 'Road trip through the Atlas Mountains and Draa Valley, arrive at the edge of the Sahara.',
      },
      {
        day: 4,
        title: 'Sahara Camel Trek',
        activities: 'Sunset camel ride into Erg Chebbi dunes, overnight in a luxury desert camp, stargazing.',
      },
      {
        day: 5,
        title: 'Sunrise & Return',
        activities: 'Watch sunrise over the dunes, drive back through Aït Benhaddou kasbah, fly home from Marrakech.',
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
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
  const [collections, setCollections] = useState(() =>
    loadFromStorage(COLLECTIONS_KEY, [])
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  }, [collections])

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
    setRatings((prev) => {
      if (stars === null) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: stars }
    })
  }

  const getRating = (id) => ratings[id] ?? null

  const addCollection = (name) => {
    const col = { id: crypto.randomUUID(), name: name.trim(), createdAt: Date.now(), tripIds: [] }
    setCollections((prev) => [col, ...prev])
    return col.id
  }

  const deleteCollection = (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }

  const addTripToCollection = (collectionId, tripId) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.tripIds.includes(tripId)
          ? { ...c, tripIds: [...c.tripIds, tripId] }
          : c
      )
    )
  }

  const removeTripFromCollection = (collectionId, tripId) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, tripIds: c.tripIds.filter((id) => id !== tripId) }
          : c
      )
    )
  }

  const getCollectionsForTrip = (tripId) =>
    collections.filter((c) => c.tripIds.includes(tripId))

  const getCollectionById = (id) => collections.find((c) => c.id === id)

  const value = {
    trips,
    addTrip,
    toggleBookmark,
    isBookmarked,
    getTripById,
    bookmarkedTrips,
    rateTrip,
    getRating,
    collections,
    addCollection,
    deleteCollection,
    addTripToCollection,
    removeTripFromCollection,
    getCollectionsForTrip,
    getCollectionById,
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

