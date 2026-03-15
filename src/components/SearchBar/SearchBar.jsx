// components/SearchBar/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, X, Camera } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { searchDrugs } from '../../services/api.js';
import api from '../../services/api.js';
import './SearchBar.css';

// ─── KNOWN DRUG LIST (for OCR matching) ──────────────────────────────────────

const knownDrugs = [
  'lipitor', 'atorvastatin', 'torvast',
  'eliquis', 'apixaban',
  'metformin', 'glucophage',
  'advil', 'ibuprofen',
  'aspirin', 'bayer aspirin',
  'tylenol', 'acetaminophen',
];

// ─── OCR HELPERS ─────────────────────────────────────────────────────────────

const parseDrugNameFromOCR = (rawText) => {
  if (!rawText) return null;

  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 2 && line.length < 50);

  // First pass: match against known drugs
  for (const line of lines) {
    const cleaned = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const match = knownDrugs.find(drug => cleaned.includes(drug));
    if (match) {
      return match.charAt(0).toUpperCase() + match.slice(1);
    }
  }

  // Fallback: return first alphabetic-only line token
  const fallback = lines.find(line => /^[A-Za-z\s\-]+$/.test(line));
  return fallback ? fallback.split(' ')[0] : null;
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Image upload states
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedDrugName, setExtractedDrugName] = useState('');

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // ── Autocomplete effect — live suggestions from API ──
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const controller = new AbortController();
    searchDrugs(query).then(response => {
      const names = (response.data || []).map(d => d.name);
      setSuggestions(names.slice(0, 6));
      setShowSuggestions(names.length > 0);
    }).catch(() => {/* ignore autocomplete errors */});
    return () => controller.abort();
  }, [query]);

  // ── Search ──
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a drug name');
      return;
    }
    setShowSuggestions(false);
    performSearch(query);
  };

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    setAlternatives(null);
    setSelectedDrug(null);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      const response = await searchDrugs(searchQuery.trim());
      const results = response.data || [];
      setSearchResults(results);
      if (results.length === 0) {
        setError(`No results found for "${searchQuery}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Image Upload ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadedImage(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    await extractTextFromImage(file);
  };

  // ── Drag & Drop ──
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = { target: { files: [file] } };
      await handleImageUpload(syntheticEvent);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // ── Tesseract OCR ──
  const extractTextFromImage = async (imageFile) => {
    setExtracting(true);
    setOcrProgress(0);
    setError('');
    setExtractedDrugName('');

    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const rawText = result.data.text;
      const detectedDrug = parseDrugNameFromOCR(rawText);

      if (detectedDrug) {
        setExtractedDrugName(detectedDrug);
        setQuery(detectedDrug);
        performSearch(detectedDrug);
      } else {
        setError('Could not detect a drug name. Try a clearer photo or type manually.');
      }
    } catch (err) {
      console.error('OCR error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setExtracting(false);
      setOcrProgress(0);
    }
  };

  // ── Drug Select ──
  const handleDrugSelect = async (drug) => {
    setSelectedDrug(drug);
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/drugs/alternatives/${drug.app_no}`);
      const altData = response.data?.data;
      if (altData) {
        setAlternatives(altData);
        if (altData.alternatives.length === 0) {
          setError(`No alternatives found for ${drug.name}`);
        }
      } else {
        setError(`No alternatives found for ${drug.name}`);
        setAlternatives({ alternatives: [] });
      }
    } catch (err) {
      console.error('Error fetching alternatives:', err);
      setError('Could not find alternatives for this drug.');
      setAlternatives({ alternatives: [] });
    } finally {
      setLoading(false);
    }
  };

  // ── Clear ──
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedDrug(null);
    setAlternatives(null);
    setError('');
    setHasSearched(false);
    setUploadedImage(null);
    setImagePreview(null);
    setExtractedDrugName('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setExtractedDrugName('');
    setOcrProgress(0);
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Search for Drug Alternatives</h2>
        <p>Type a drug name or upload a medicine photo</p>
      </div>

      {/* ── Search Form ── */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <div className="search-input-inner">
            <Search className="search-icon" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Enter drug name (e.g., Lipitor, Metformin, Advil)"
              className="search-input"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear"
              style={{ display: query ? 'flex' : 'none' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <ul className="suggestions-dropdown">
              {suggestions.map((name) => (
                <li
                  key={name}
                  className="suggestion-item"
                  onMouseDown={() => {
                    setQuery(name);
                    setShowSuggestions(false);
                    performSearch(name);
                  }}
                >
                  <Search size={13} className="suggestion-icon" />
                  <span>
                    <strong>{name.slice(0, query.length)}</strong>
                    {name.slice(query.length)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? (
            <><span className="btn-spinner" /> Searching...</>
          ) : (
            <><Search size={16} /> Search</>
          )}
        </button>
      </form>

      {/* ── OR Divider ── */}
      <div className="divider"><span>OR</span></div>

      {/* ── Image Upload Section ── */}
      <div className="image-upload-section">
        <h3>Upload Medicine Photo</h3>
        <p className="upload-hint">Take a clear photo of the medicine label or packaging</p>

        <div
          className={`upload-area ${imagePreview ? 'has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!imagePreview ? (
            <label htmlFor="image-upload" className="upload-label">
              <div className="upload-icon">
                <Camera size={48} />
              </div>
              <p className="upload-text">Click to upload or drag & drop</p>
              <p className="upload-subtext">PNG, JPG up to 5MB</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="upload-input"
              />
            </label>
          ) : (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Uploaded medicine" className="image-preview" />

              <button onClick={clearImage} className="remove-image-btn" type="button">
                <X size={16} /> Remove
              </button>

              {/* OCR Progress Overlay */}
              {extracting && (
                <div className="extracting-overlay">
                  <div className="ocr-spinner" />
                  <p className="ocr-status-text">Reading label... {ocrProgress}%</p>
                  <div className="ocr-progress-bar">
                    <div className="ocr-progress-fill" style={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {extractedDrugName && !extracting && (
                <div className="extracted-result">
                  <div className="extracted-icon">✓</div>
                  <div>
                    <p className="extracted-label">Detected Drug:</p>
                    <p className="extracted-name">{extractedDrugName}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Error Message ── */}
      {error && !loading && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Searching...</p>
        </div>
      )}

      {/* ── Search Results ── */}
      {searchResults.length > 0 && !selectedDrug && !loading && (
        <div className="search-results">
          <div className="results-title-row">
            <h3>Search Results <span className="results-count">{searchResults.length}</span></h3>
            {extractedDrugName && (
              <span className="image-source-badge"><Camera size={13} /> From image</span>
            )}
          </div>
          <p className="results-hint">Click on a drug to see alternatives</p>

          <div className="results-grid">
            {searchResults.map(drug => (
              <div key={drug.id} className="result-card" onClick={() => handleDrugSelect(drug)}>
                <div className="result-header">
                  <h4>{drug.name}</h4>
                  {drug.patent_expired ? (
                    <span className="badge green">Generic Available</span>
                  ) : (
                    <span className="badge orange">Brand Only</span>
                  )}
                </div>
                <p className="generic-name">{drug.generic_name}</p>
                <div className="drug-info">
                  <span>{drug.dosage_form}</span>
                  <span>•</span>
                  <span>{drug.strength}</span>
                </div>
                {!drug.patent_expired && drug.patent_expiry && (
                  <p className="expiry-info">
                    Patent expires: {new Date(drug.patent_expiry).toLocaleDateString()}
                  </p>
                )}
                <button className="view-btn" type="button">View Alternatives →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alternatives Display ── */}
      {alternatives && selectedDrug && !loading && (
        <div className="alternatives-section">
          <div className="alternatives-header">
            <div>
              <h3>Alternatives for {selectedDrug.name}</h3>
              {extractedDrugName && (
                <span className="extraction-badge">
                  <Camera size={13} /> Detected from uploaded image
                </span>
              )}
              <p className="active-ingredient">
                <strong>Active Ingredient:</strong> {alternatives.active_ingredient}
              </p>
            </div>
            <button onClick={clearSearch} className="back-button" type="button">← New Search</button>
          </div>

          {alternatives.alternatives && alternatives.alternatives.length > 0 ? (
            <div className="alternatives-grid">
              {/* Original Drug */}
              <div className="alternative-card original">
                <div className="card-badge">Original Drug</div>
                <div className="card-header">
                  <h4>{selectedDrug.name}</h4>
                  {selectedDrug.patent_expired ? (
                    <span className="badge green">Generic Available</span>
                  ) : (
                    <span className="badge orange">Brand Only</span>
                  )}
                </div>
                <p className="generic-name">{selectedDrug.generic_name}</p>
                <div className="drug-details">
                  <span>{selectedDrug.dosage_form}</span>
                  <span>•</span>
                  <span>{selectedDrug.strength}</span>
                </div>
              </div>

              {/* Alternatives */}
              {alternatives.alternatives.map(alt => (
                <div key={alt.id} className="alternative-card">
                  <div className="card-badge alternative">Alternative</div>
                  <div className="card-header">
                    <h4>{alt.name}</h4>
                    {alt.patent_expired ? (
                      <span className="badge green">Generic Available</span>
                    ) : (
                      <span className="badge orange">Brand Only</span>
                    )}
                  </div>
                  <p className="generic-name">{alt.generic_name}</p>
                  <div className="drug-details">
                    <span>{alt.dosage_form}</span>
                    <span>•</span>
                    <span>{alt.strength}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-alternatives">
              <div className="no-alt-icon">🔍</div>
              <p>No alternatives found for this drug.</p>
            </div>
          )}
        </div>
      )}

      {/* ── No Results State ── */}
      {hasSearched && searchResults.length === 0 && !loading && !error && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No drugs found</h3>
          <p>Try searching for:</p>
          <div className="suggestions">
            {['Lipitor', 'Metformin', 'Advil', 'Aspirin', 'Tylenol'].map(name => (
              <button
                key={name}
                type="button"
                onClick={() => { setQuery(name); performSearch(name); }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}