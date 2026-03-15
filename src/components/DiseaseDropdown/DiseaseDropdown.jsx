// components/DiseaseDropdown/DiseaseDropdown.jsx
import { useState, useEffect } from 'react';
import { getDiseases, getDrugsByDisease } from '../../services/api.js';
import './DiseaseDropdown.css';

export default function DiseaseDropdown() {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load diseases when component mounts
  useEffect(() => {
    loadDiseases();
  }, []);

  const loadDiseases = async () => {
    try {
      const response = await getDiseases();
      setDiseases(response.data || []);
    } catch (error) {
      console.error('Error loading diseases:', error);
      setError('Failed to load diseases. Please try again.');
    }
  };

  const handleDiseaseSelect = async (e) => {
    const disease = e.target.value;
    setSelectedDisease(disease);

    if (!disease) {
      setDrugs([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getDrugsByDisease(disease);
      const drugsForDisease = response.data || [];
      setDrugs(drugsForDisease);

      if (drugsForDisease.length === 0) {
        setError('No medications found for this disease.');
      }
    } catch (error) {
      console.error('Error loading drugs:', error);
      setError('Failed to load drugs for this disease.');
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-dropdown-container">
      <div className="dropdown-header">
        <h2>Find Medicines by Disease</h2>
        <p>Select a disease to see available medications and alternatives</p>
      </div>
      
      <div className="dropdown-wrapper">
        <select 
          value={selectedDisease}
          onChange={handleDiseaseSelect}
          className="disease-select"
        >
          <option value="">-- Select a disease --</option>
          {diseases.map(disease => (
            <option key={disease} value={disease}>
              {disease}
            </option>
          ))}
        </select>
      </div>

      {error && !loading && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading drugs...</p>
        </div>
      )}

      {!loading && drugs.length > 0 && (
        <div className="drugs-list">
          <h3>Medicines for {selectedDisease}</h3>
          <p className="results-count">{drugs.length} medication(s) found</p>
          
          <div className="drugs-grid">
            {drugs.map(drug => (
              <div key={drug.id} className="drug-card">
                <div className="drug-card-header">
                  <h4>{drug.name}</h4>
                  {drug.patent_expired ? (
                    <span className="status-badge expired">Generic Available</span>
                  ) : (
                    <span className="status-badge active">Brand Only</span>
                  )}
                </div>
                
                <div className="drug-card-body">
                  <p className="generic-name">
                    <strong>Generic:</strong> {drug.generic_name}
                  </p>
                  <div className="drug-details">
                    <span className="detail-item">
                      <strong>Form:</strong> {drug.dosage_form}
                    </span>
                    <span className="detail-item">
                      <strong>Strength:</strong> {drug.strength}
                    </span>
                  </div>
                  
                  {drug.patent_expiry && !drug.patent_expired && (
                    <p className="expiry-date">
                      <strong>Patent Expiry:</strong> {new Date(drug.patent_expiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && selectedDisease && drugs.length === 0 && !error && (
        <div className="no-results">
          <p>No medications found for {selectedDisease}</p>
        </div>
      )}
    </div>
  );
}