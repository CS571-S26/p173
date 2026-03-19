import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext.jsx'

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function CreateTripPage() {
  const navigate = useNavigate()
  const { addTrip } = useTrips()

  const [title, setTitle] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')

  const [dayCount, setDayCount] = useState(3)
  const [days, setDays] = useState(() =>
    Array.from({ length: 3 }, (_, i) => ({
      day: i + 1,
      title: '',
      activities: '',
    }))
  )

  const [coverFile, setCoverFile] = useState(null)
  const [photoFiles, setPhotoFiles] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      country.trim().length >= 2 &&
      description.trim().length >= 10
    )
  }, [title, country, description])

  const setDayField = (index, field, value) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    )
  }

  const onChangeDayCount = (nextCount) => {
    const clamped = Math.max(1, Math.min(21, nextCount))
    setDayCount(clamped)
    setDays((prev) => {
      const next = [...prev]
      if (clamped > next.length) {
        for (let i = next.length; i < clamped; i++) {
          next.push({ day: i + 1, title: '', activities: '' })
        }
      } else if (clamped < next.length) {
        next.length = clamped
      }
      return next.map((d, idx) => ({ ...d, day: idx + 1 }))
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSubmit) {
      setError('Please fill in title, country, and a longer description.')
      return
    }

    setSubmitting(true)
    try {
      const coverImage = coverFile ? await toDataUrl(coverFile) : ''
      const photos = photoFiles.length
        ? await Promise.all(photoFiles.map((f) => toDataUrl(f)))
        : []

      const itinerary = days.map((d) => ({
        day: d.day,
        title: d.title.trim() || `Day ${d.day}`,
        activities: d.activities.trim(),
      }))

      const trip = {
        title: title.trim(),
        country: country.trim(),
        description: description.trim(),
        coverImage,
        photos,
        itinerary,
      }

      addTrip(trip)
      navigate('/')
    } catch {
      setError('Failed to create trip. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Create a Trip</h2>
          <p className="page-description">
            Add photos, a description, and a day-by-day itinerary.
          </p>
        </div>
      </header>

      <form className="form card" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="field">
            <label className="field-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend in Lisbon"
              required
              minLength={3}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Portugal"
              required
              minLength={2}
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What made this trip special? What should someone else do?"
            required
            minLength={10}
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label className="field-label" htmlFor="cover">
              Cover photo (optional)
            </label>
            <input
              id="cover"
              type="file"
              accept="image/*"
              className="input file"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
            <p className="help-text">
              Stored locally (as a data URL) so GitHub Pages works without a
              backend.
            </p>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="photos">
              Additional photos (optional)
            </label>
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              className="input file"
              onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
            />
          </div>
        </div>

        <div className="card-divider" />

        <div className="form-row form-row-center">
          <div className="field">
            <label className="field-label" htmlFor="dayCount">
              Number of days
            </label>
            <input
              id="dayCount"
              type="number"
              min={1}
              max={21}
              className="input"
              value={dayCount}
              onChange={(e) => onChangeDayCount(Number(e.target.value))}
            />
          </div>
          <div className="field form-row-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Creating…' : 'Create trip'}
            </button>
          </div>
        </div>

        <div className="itinerary-editor">
          {days.map((d, idx) => (
            <div key={d.day} className="itinerary-editor-day">
              <div className="itinerary-editor-heading">Day {d.day}</div>
              <div className="form-row">
                <div className="field">
                  <label className="field-label" htmlFor={`day-title-${d.day}`}>
                    Title
                  </label>
                  <input
                    id={`day-title-${d.day}`}
                    className="input"
                    value={d.title}
                    onChange={(e) => setDayField(idx, 'title', e.target.value)}
                    placeholder="e.g. Museums & cafes"
                  />
                </div>
                <div className="field">
                  <label
                    className="field-label"
                    htmlFor={`day-activities-${d.day}`}
                  >
                    Activities
                  </label>
                  <textarea
                    id={`day-activities-${d.day}`}
                    className="input textarea small"
                    value={d.activities}
                    onChange={(e) =>
                      setDayField(idx, 'activities', e.target.value)
                    }
                    placeholder="Where did you go? What did you eat? Any tips?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error ? <div className="form-error">{error}</div> : null}
      </form>
    </section>
  )
}

export default CreateTripPage

