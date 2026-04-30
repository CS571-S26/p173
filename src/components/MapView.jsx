import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { useTrips } from '../context/TripContext.jsx'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Coordinates [longitude, latitude] for common travel countries
const COUNTRY_COORDS = {
  'Afghanistan': [67.7, 33.9], 'Albania': [20.2, 41.2], 'Algeria': [2.6, 28.0],
  'Argentina': [-64.9, -34.6], 'Australia': [133.8, -25.3], 'Austria': [14.5, 47.5],
  'Bangladesh': [90.4, 23.7], 'Belgium': [4.5, 50.5], 'Bolivia': [-64.7, -16.3],
  'Brazil': [-51.9, -14.2], 'Cambodia': [104.9, 12.6], 'Canada': [-96.8, 56.1],
  'Chile': [-71.5, -35.7], 'China': [104.2, 35.9], 'Colombia': [-74.3, 4.6],
  'Croatia': [15.2, 45.1], 'Cuba': [-79.5, 21.5], 'Czech Republic': [15.5, 49.8],
  'Denmark': [10.0, 56.3], 'Ecuador': [-78.1, -1.8], 'Egypt': [30.8, 26.8],
  'Ethiopia': [40.5, 9.1], 'Finland': [25.7, 61.9], 'France': [2.3, 46.2],
  'Germany': [10.5, 51.2], 'Ghana': [-1.0, 7.9], 'Greece': [22.0, 39.1],
  'Guatemala': [-90.2, 15.8], 'Hungary': [19.5, 47.2], 'Iceland': [-19.0, 64.9],
  'India': [78.9, 20.6], 'Indonesia': [113.9, -0.8], 'Iran': [53.7, 32.4],
  'Iraq': [43.7, 33.2], 'Ireland': [-8.2, 53.4], 'Israel': [34.9, 31.5],
  'Italy': [12.6, 41.9], 'Jamaica': [-77.3, 18.1], 'Japan': [138.3, 36.2],
  'Jordan': [36.2, 30.6], 'Kenya': [37.9, 0.0], 'Laos': [103.0, 18.0],
  'Lebanon': [35.9, 33.9], 'Madagascar': [46.9, -18.8], 'Malaysia': [109.7, 4.2],
  'Mexico': [-102.6, 23.6], 'Mongolia': [103.8, 46.9], 'Morocco': [-7.1, 31.8],
  'Myanmar': [96.7, 17.1], 'Nepal': [84.1, 28.4], 'Netherlands': [5.3, 52.1],
  'New Zealand': [172.0, -42.0], 'Nigeria': [8.7, 9.1], 'Norway': [8.5, 60.5],
  'Pakistan': [69.3, 30.4], 'Panama': [-80.8, 8.5], 'Peru': [-75.0, -9.2],
  'Philippines': [122.9, 12.9], 'Poland': [19.1, 52.1], 'Portugal': [-8.2, 39.4],
  'Romania': [24.9, 45.9], 'Russia': [105.3, 61.5], 'Saudi Arabia': [45.1, 24.2],
  'Senegal': [-14.5, 14.5], 'Singapore': [103.8, 1.4], 'South Africa': [25.1, -29.0],
  'South Korea': [127.8, 35.9], 'Spain': [-3.7, 40.5], 'Sri Lanka': [80.7, 7.9],
  'Sweden': [18.6, 60.1], 'Switzerland': [8.2, 46.8], 'Taiwan': [120.9, 23.7],
  'Tanzania': [35.0, -6.4], 'Thailand': [100.9, 15.9], 'Turkey': [35.2, 38.9],
  'Uganda': [32.3, 1.4], 'Ukraine': [31.2, 48.4], 'United Arab Emirates': [54.0, 24.0],
  'United Kingdom': [-3.4, 55.4], 'USA': [-95.7, 37.1], 'United States': [-95.7, 37.1],
  'Uruguay': [-55.8, -32.5], 'Uzbekistan': [63.9, 41.4], 'Venezuela': [-66.6, 6.4],
  'Vietnam': [108.3, 14.1], 'Zambia': [27.8, -13.1], 'Zimbabwe': [29.9, -19.0],
}

function MapView({ onSelectCountry }) {
  const { trips } = useTrips()
  const navigate = useNavigate()
  const [tooltip, setTooltip] = useState(null)

  // Group trips by country
  const byCountry = trips.reduce((acc, trip) => {
    const key = trip.country.trim()
    if (!acc[key]) acc[key] = []
    acc[key].push(trip)
    return acc
  }, {})

  const markers = Object.entries(byCountry)
    .map(([country, countryTrips]) => ({
      country,
      trips: countryTrips,
      coords: COUNTRY_COORDS[country] ?? null,
    }))
    .filter((m) => m.coords !== null)

  const handleMarkerClick = (country) => {
    onSelectCountry(country)
  }

  return (
    <div className="map-wrapper">
      {tooltip && (
        <div className="map-tooltip">
          <strong>{tooltip.country}</strong>
          <span>{tooltip.count} trip{tooltip.count !== 1 ? 's' : ''}</span>
        </div>
      )}
      <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup center={[0, 20]} minZoom={1} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--map-land)"
                  stroke="var(--map-border)"
                  strokeWidth={0.4}
                  style={{ outline: 'none' }}
                />
              ))
            }
          </Geographies>

          {markers.map(({ country, trips: countryTrips, coords }) => (
            <Marker
              key={country}
              coordinates={coords}
              onClick={() => handleMarkerClick(country)}
              onMouseEnter={() => setTooltip({ country, count: countryTrips.length })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={6}
                fill="var(--accent, #7c6af7)"
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.9}
                role="button"
                tabIndex={0}
                aria-label={`${country}: ${countryTrips.length} trip${countryTrips.length !== 1 ? 's' : ''}. Press Enter to filter.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleMarkerClick(country)
                  }
                }}
              />
              <circle r={10} fill="var(--accent, #7c6af7)" opacity={0.25} aria-hidden="true" />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {markers.length === 0 && (
        <div className="map-empty">No trips with known coordinates yet.</div>
      )}
    </div>
  )
}

export default MapView
