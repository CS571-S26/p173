const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'country', label: 'Country A–Z' },
]

function SortBar({ sort, onSort }) {
  return (
    <div className="sort-bar">
      <span className="sort-label">Sort:</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`sort-btn ${sort === opt.value ? 'sort-btn-active' : ''}`}
          onClick={() => onSort(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default SortBar
