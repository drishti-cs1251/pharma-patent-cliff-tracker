// components/DiseaseDropdown/DiseaseDropdown.jsx
import { useState, useEffect } from 'react';
import './DiseaseDropdown.css';

// MOCK DATA for Week 1
const mockDiseases = [
  'Diabetes', 'Hypertension', 'High Cholesterol', 'Heart Disease',
  'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'GERD', 'Migraine'
];

const mockDrugsData = {
  'Diabetes': [
    { id: 1, name: 'METFORMIN', generic_name: 'Metformin HCl', dosage_form: 'Tablet', strength: '500mg', patent_expired: true },
    { id: 2, name: 'JANUVIA', generic_name: 'Sitagliptin', dosage_form: 'Tablet', strength: '100mg', patent_expired: false, patent_expiry: '2027-03-15' },
    { id: 3, name: 'LANTUS', generic_name: 'Insulin Glargine', dosage_form: 'Injection', strength: '100 units/mL', patent_expired: false, patent_expiry: '2026-08-20' }
  ],
  'Hypertension': [
    { id: 4, name: 'LISINOPRIL', generic_name: 'Lisinopril', dosage_form: 'Tablet', strength: '10mg', patent_expired: true },
    { id: 5, name: 'AMLODIPINE', generic_name: 'Amlodipine', dosage_form: 'Tablet', strength: '5mg', patent_expired: true },
    { id: 6, name: 'LOSARTAN', generic_name: 'Losartan', dosage_form: 'Tablet', strength: '50mg', patent_expired: true }
  ],
  'High Cholesterol': [
    { id: 7, name: 'LIPITOR', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '10mg', patent_expired: true },
    { id: 8, name: 'CRESTOR', generic_name: 'Rosuvastatin', dosage_form: 'Tablet', strength: '20mg', patent_expired: true },
    { id: 9, name: 'ZOCOR', generic_name: 'Simvastatin', dosage_form: 'Tablet', strength: '40mg', patent_expired: true }
  ],
  'Heart Disease': [
    { id: 10, name: 'PLAVIX', generic_name: 'Clopidogrel', dosage_form: 'Tablet', strength: '75mg', patent_expired: true },
    { id: 11, name: 'ELIQUIS', generic_name: 'Apixaban', dosage_form: 'Tablet', strength: '5mg', patent_expired: false, patent_expiry: '2026-03-15' },
    { id: 12, name: 'ASPIRIN', generic_name: 'Aspirin', dosage_form: 'Tablet', strength: '81mg', patent_expired: true }
  ],
  'Asthma': [
    { id: 13, name: 'ADVAIR', generic_name: 'Fluticasone/Salmeterol', dosage_form: 'Inhaler', strength: '250/50 mcg', patent_expired: false, patent_expiry: '2028-01-10' },
    { id: 14, name: 'ALBUTEROL', generic_name: 'Albuterol', dosage_form: 'Inhaler', strength: '90 mcg', patent_expired: true }
  ],
  'Arthritis': [
    { id: 15, name: 'HUMIRA', generic_name: 'Adalimumab', dosage_form: 'Injection', strength: '40mg', patent_expired: false, patent_expiry: '2027-12-31' },
    { id: 16, name: 'CELEBREX', generic_name: 'Celecoxib', dosage_form: 'Capsule', strength: '200mg', patent_expired: true }
  ],
  'Depression': [
    { id: 17, name: 'PROZAC', generic_name: 'Fluoxetine', dosage_form: 'Capsule', strength: '20mg', patent_expired: true },
    { id: 18, name: 'ZOLOFT', generic_name: 'Sertraline', dosage_form: 'Tablet', strength: '50mg', patent_expired: true }
  ],
  'Anxiety': [
    { id: 19, name: 'XANAX', generic_name: 'Alprazolam', dosage_form: 'Tablet', strength: '0.5mg', patent_expired: true },
    { id: 20, name: 'ATIVAN', generic_name: 'Lorazepam', dosage_form: 'Tablet', strength: '1mg', patent_expired: true }
  ],
  'GERD': [
    { id: 21, name: 'NEXIUM', generic_name: 'Esomeprazole', dosage_form: 'Capsule', strength: '40mg', patent_expired: true },
    { id: 22, name: 'PRILOSEC', generic_name: 'Omeprazole', dosage_form: 'Capsule', strength: '20mg', patent_expired: true }
  ],
  'Migraine': [
    { id: 23, name: 'IMITREX', generic_name: 'Sumatriptan', dosage_form: 'Tablet', strength: '50mg', patent_expired: true },
    { id: 24, name: 'AIMOVIG', generic_name: 'Erenumab', dosage_form: 'Injection', strength: '70mg', patent_expired: false, patent_expiry: '2029-05-17' }
  ]
};

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiseases(mockDiseases);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const drugsForDisease = mockDrugsData[disease] || [];
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