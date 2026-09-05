import { useMemo, useState } from 'react';

function SearchBar({ placeholder = 'Search...', items = [], onSelect }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((it) => it.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, items]);

  return (
    <div className="searchbar-wrap">
      <input
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <button
              key={r.label}
              type="button"
              className="search-result"
              onClick={() => {
                setQuery('');
                onSelect && onSelect(r);
              }}
            >
              <div className="result-label">{r.label}</div>
              {r.subtitle && <div className="result-sub">{r.subtitle}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
