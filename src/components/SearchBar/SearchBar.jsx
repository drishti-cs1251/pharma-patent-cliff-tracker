// components/SearchBar/SearchBar.jsx
import { useState } from 'react';
import { Search, X, Camera, Upload } from 'lucide-react';
import './SearchBar.css';

// MOCK DATA (same as before)
const mockSearchResults = {
  'lipitor': [
    { id: 1, name: 'LIPITOR', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true },
    { id: 2, name: 'ATORVASTATIN', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true },
    { id: 3, name: 'TORVAST', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true }
  ],
  'eliquis': [
    { id: 4, name: 'ELIQUIS', generic_name: 'Apixaban', dosage_form: 'Tablet', strength: '5mg', patent_expired: false, patent_expiry: '2026-03-15' }
  ],
  'metformin': [
    { id: 6, name: 'METFORMIN', generic_name: 'Metformin HCl', dosage_form: 'Tablet', strength: '500mg', patent_expired: true },
    { id: 7, name: 'GLUCOPHAGE', generic_name: 'Metformin HCl', dosage_form: 'Tablet', strength: '500mg', patent_expired: true }
  ],
  'advil': [
    { id: 9, name: 'ADVIL', generic_name: 'Ibuprofen', dosage_form: 'Tablet', strength: '200mg', patent_expired: true },
    { id: 10, name: 'IBUPROFEN', generic_name: 'Ibuprofen', dosage_form: 'Tablet', strength: '200mg', patent_expired: true }
  ],
  'aspirin': [
    { id: 18, name: 'ASPIRIN', generic_name: 'Aspirin', dosage_form: 'Tablet', strength: '81mg', patent_expired: true },
    { id: 19, name: 'BAYER ASPIRIN', generic_name: 'Aspirin', dosage_form: 'Tablet', strength: '81mg', patent_expired: true }
  ],
  'tylenol': [
    { id: 20, name: 'TYLENOL', generic_name: 'Acetaminophen', dosage_form: 'Tablet', strength: '500mg', patent_expired: true },
    { id: 21, name: 'ACETAMINOPHEN', generic_name: 'Acetaminophen', dosage_form: 'Tablet', strength: '500mg', patent_expired: true }
  ]
};

const mockAlternatives = {
  'LIPITOR': {
    active_ingredient: 'Atorvastatin',
    alternatives: [
      { id: 2, name: 'ATORVASTATIN', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true },
      { id: 3, name: 'TORVAST', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true }
    ]
  },
  'ASPIRIN': {
    active_ingredient: 'Aspirin',
    alternatives: [
      { id: 19, name: 'BAYER ASPIRIN', generic_name: 'Aspirin', dosage_form: 'Tablet', strength: '81mg', patent_expired: true }
    ]
  },
  'TYLENOL': {
    active_ingredient: 'Acetaminophen',
    alternatives: [
      { id: 21, name: 'ACETAMINOPHEN', generic_name: 'Acetaminophen', dosage_form: 'Tablet', strength: '500mg', patent_expired: true }
    ]
  }
};

// Mock OCR function (simulates text extraction from image)
const mockOCR = async (imageFile) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock: Randomly return one of these drug names
  const mockDrugs = ['Lipitor', 'Aspirin', 'Tylenol', 'Advil', 'Metformin'];
  const randomDrug = mockDrugs[Math.floor(Math.random() * mockDrugs.length)];
  
  return {
    success: true,
    extractedText: randomDrug,
    confidence: 0.85
  };
};

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
  const [extractedDrugName, setExtractedDrugName] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a drug name');
      return;
    }

    performSearch(query);
  };

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    setAlternatives(null);
    setSelectedDrug(null);
    setHasSearched(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const searchKey = searchQuery.toLowerCase().trim();
      const results = mockSearchResults[searchKey] || [];
      
      setSearchResults(results);
      
      if (results.length === 0) {
        setError(`No results found for "${searchQuery}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Extract text from image
    await extractTextFromImage(file);
  };

  const extractTextFromImage = async (imageFile) => {
    setExtracting(true);
    setError('');
    setExtractedDrugName('');

    try {
      // TODO: Replace with actual OCR API call in production
      // For now, using mock OCR
      const result = await mockOCR(imageFile);

      if (result.success) {
        setExtractedDrugName(result.extractedText);
        setQuery(result.extractedText);
        
        // Automatically search for the extracted drug
        performSearch(result.extractedText);
      } else {
        setError('Could not extract drug name from image. Please try typing manually.');
      }
    } catch (error) {
      console.error('OCR error:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setExtracting(false);
    }
  };

  const handleDrugSelect = async (drug) => {
    setSelectedDrug(drug);
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const altData = mockAlternatives[drug.name];
      
      if (altData) {
        setAlternatives(altData);
        if (altData.alternatives.length === 0) {
          setError(`No alternatives found for ${drug.name}`);
        }
      } else {
        setError(`No alternatives found for ${drug.name}`);
        setAlternatives({ alternatives: [] });
      }
    } catch (error) {
      console.error('Error fetching alternatives:', error);
      setError('Could not find alternatives for this drug.');
      setAlternatives({ alternatives: [] });
    } finally {
      setLoading(false);
    }
  };

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
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setExtractedDrugName('');
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Search for Drug Alternatives</h2>
        <p>Type a drug name or upload a medicine photo</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter drug name (e.g., Lipitor, Metformin, Advil)"
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* OR Divider */}
      <div className="divider">
        <span>OR</span>
      </div>

      {/* Image Upload Section */}
      <div className="image-upload-section">
        <h3>Upload Medicine Photo</h3>
        <p className="upload-hint">Take a clear photo of the medicine label or packaging</p>
        
        <div className="upload-area">
          {!imagePreview ? (
            <label htmlFor="image-upload" className="upload-label">
              <div className="upload-icon">
                <Camera size={48} />
              </div>
              <p className="upload-text">Click to upload or drag and drop</p>
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
              <button onClick={clearImage} className="remove-image-btn">
                <X size={20} /> Remove
              </button>
              
              {extracting && (
                <div className="extracting-overlay">
                  <div className="spinner"></div>
                  <p>Extracting text from image...</p>
                </div>
              )}
              
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

        {extracting && (
          <div className="extraction-status">
            <div className="status-icon">🔍</div>
            <p>Analyzing image and extracting drug name...</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && !loading && (
        <div className="error-message">{error}</div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedDrug && !loading && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {extractedDrugName && (
            <p className="results-hint">
              <strong>Found from image:</strong> {extractedDrugName}
            </p>
          )}
          {!extractedDrugName && (
            <p className="results-hint">Click on a drug to see alternatives</p>
          )}
          
          <div className="results-grid">
            {searchResults.map(drug => (
              <div
                key={drug.id}
                className="result-card"
                onClick={() => handleDrugSelect(drug)}
              >
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
                <button className="view-btn">
                  View Alternatives →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives Display */}
      {alternatives && selectedDrug && !loading && (
        <div className="alternatives-section">
          <div className="alternatives-header">
            <div>
              <h3>Alternatives for {selectedDrug.name}</h3>
              {extractedDrugName && (
                <p className="extraction-badge">
                  <Camera size={16} /> Detected from uploaded image
                </p>
              )}
              <p className="active-ingredient">
                <strong>Active Ingredient:</strong> {alternatives.active_ingredient}
              </p>
            </div>
            <button onClick={clearSearch} className="back-button">
              ← New Search
            </button>
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

      {/* No Results State */}
      {hasSearched && searchResults.length === 0 && !loading && !error && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No drugs found</h3>
          <p>Try searching for:</p>
          <div className="suggestions">
            <button onClick={() => { setQuery('Lipitor'); }}>Lipitor</button>
            <button onClick={() => { setQuery('Metformin'); }}>Metformin</button>
            <button onClick={() => { setQuery('Advil'); }}>Advil</button>
          </div>
        </div>
      )}
    </div>
  );
}