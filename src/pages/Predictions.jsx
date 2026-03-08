// src/pages/Predictions.jsx
import { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Predictions.css';

const CATEGORIES = ['Oral', 'Injectable', 'Respiratory', 'Topical', 'Other'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - 49 + i).reverse();
const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' },   { value: 4, label: 'April' },
  { value: 5, label: 'May' },     { value: 6, label: 'June' },
  { value: 7, label: 'July' },    { value: 8, label: 'August' },
  { value: 9, label: 'September'},{ value: 10, label: 'October' },
  { value: 11, label: 'November'},{ value: 12, label: 'December' },
];

export default function Predictions() {
  const [drugName, setDrugName]         = useState('');
  const [approvalYear, setApprovalYear] = useState('');
  const [approvalMonth, setApprovalMonth] = useState('');
  const [category, setCategory]         = useState('Oral');

  const [expiryResult, setExpiryResult]     = useState(null);
  const [statusResult, setStatusResult]     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  const ML_BASE = 'http://localhost:5001';

  const handlePredict = async (e) => {
    e.preventDefault();
    setError('');
    setExpiryResult(null);
    setStatusResult(null);

    if (!approvalYear || !approvalMonth) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // --- Model 1: predict patent expiry date ---
      const expiryRes = await fetch(`${ML_BASE}/api/predict-expiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_year: parseInt(approvalYear),
          approval_month: parseInt(approvalMonth),
          app_type: 'N',
          category,
        }),
      });
      const expiryData = await expiryRes.json();
      if (!expiryData.success) throw new Error(expiryData.error);
      setExpiryResult(expiryData.prediction);

      // --- Model 2: classify patent status using predicted expiry ---
      const pred = expiryData.prediction;
      const expiryDate = new Date(pred.predicted_expiry_date);
      const today = new Date();
      const daysFromToday = Math.round((expiryDate - today) / (1000 * 60 * 60 * 24));
      const lifetimeDays = Math.round(pred.predicted_lifetime_years * 365);

      const statusRes = await fetch(`${ML_BASE}/api/classify-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiry_year: expiryDate.getFullYear(),
          expiry_month: expiryDate.getMonth() + 1,
          expiry_day: expiryDate.getDate(),
          patent_lifetime_days: lifetimeDays,
          days_from_today: daysFromToday,
        }),
      });
      const statusData = await statusRes.json();
      if (!statusData.success) throw new Error(statusData.error);
      setStatusResult(statusData.result);

    } catch (err) {
      setError(err.message || 'Prediction failed. Is the ML server running on port 5001?');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#888';
    return status === 'Expired' ? '#e74c3c' : '#27ae60';
  };

  const getConfidenceBadge = (level) => {
    const colors = { Low: '#e67e22', Medium: '#f1c40f', High: '#27ae60' };
    return colors[level] || '#888';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getSavingsEstimate = (category) => {
    const estimates = {
      Oral: '60–80%', Injectable: '40–70%',
      Respiratory: '50–75%', Topical: '55–70%', Other: '50–70%'
    };
    return estimates[category] || '50–70%';
  };

  return (
    <div className="predictions-page">
      <Header />

      <main className="predictions-main">
        {/* Hero */}
        <section className="pred-hero">
          <div className="pred-hero-content">
            <div className="pred-badge">🤖 ML-Powered</div>
            <h1>Patent Expiry Predictor</h1>
            <p>
              Enter drug approval details to predict when the patent will expire
              and whether a generic alternative may soon be available.
            </p>
          </div>
        </section>

        <div className="pred-body">
          {/* Form */}
          <section className="pred-form-section">
            <div className="pred-form-card">
              <h2>Enter Drug Details</h2>
              <p className="form-note">
                ℹ️ The ML model uses FDA approval data to predict patent lifetime.
                  Predictions are based on historical patterns and are not official FDA information.
              </p>

              <form onSubmit={handlePredict} className="pred-form">
                {/* Drug Name (optional) */}
                <div className="form-group">
                  <label>Drug / Brand Name <span className="optional">(optional)</span></label>
                  <input
                    type="text"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="e.g. Eliquis, Ozempic, Jardiance"
                    className="pred-input"
                  />
                </div>

                {/* Approval Year & Month */}
                <div className="form-row">
                  <div className="form-group">
                    <label>FDA Approval Year <span className="required">*</span></label>
                    <select
                      value={approvalYear}
                      onChange={(e) => setApprovalYear(e.target.value)}
                      className="pred-select"
                      required
                    >
                      <option value="">Select year</option>
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>FDA Approval Month <span className="required">*</span></label>
                    <select
                      value={approvalMonth}
                      onChange={(e) => setApprovalMonth(e.target.value)}
                      className="pred-select"
                      required
                    >
                      <option value="">Select month</option>
                      {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>Drug Category <span className="required">*</span></label>
                  <div className="category-grid">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-btn ${category === cat ? 'selected' : ''}`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat === 'Oral' && '💊'} 
                        {cat === 'Injectable' && '💉'} 
                        {cat === 'Respiratory' && '🫁'} 
                        {cat === 'Topical' && '🧴'} 
                        {cat === 'Other' && '🔬'} 
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <div className="pred-error">⚠️ {error}</div>}

                <button type="submit" className="pred-submit" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner">⏳ Running ML Models...</span>
                  ) : (
                    '🔮 Predict Patent Expiry'
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Results */}
          {(expiryResult || statusResult) && (
            <section className="pred-results">
              <h2>
                Prediction Results
                {drugName && <span className="drug-name-badge"> for "{drugName}"</span>}
              </h2>

              <div className="results-grid">
                {/* Expiry Prediction Card */}
                {expiryResult && (
                  <div className="result-card expiry-card">
                    <div className="result-card-header">
                      <span className="result-icon">📅</span>
                      <h3>Predicted Patent Expiry</h3>
                    </div>
                    <div className="result-main">
                      <div className="result-date">
                        {formatDate(expiryResult.predicted_expiry_date)}
                      </div>
                      <div className="result-sub">
                        ~{expiryResult.predicted_lifetime_years} years patent lifetime
                      </div>
                    </div>
                    <div className="result-meta">
                      <div className="meta-item">
                        <span className="meta-label">Confidence</span>
                        <span
                          className="meta-value confidence-badge"
                          style={{ background: getConfidenceBadge(expiryResult.confidence_level) }}
                        >
                          {expiryResult.confidence_level}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Margin of Error</span>
                        <span className="meta-value">±{Math.round(expiryResult.confidence_interval_days / 365 * 10) / 10} years</span>
                      </div>
                    </div>
                    <div className="result-note">
                      {expiryResult.note}
                    </div>
                  </div>
                )}

                {/* Status Classification Card */}
                {statusResult && (
                  <div className="result-card status-card">
                    <div className="result-card-header">
                      <span className="result-icon">🏷️</span>
                      <h3>Patent Status</h3>
                    </div>
                    <div className="result-main">
                      <div
                        className="status-badge-large"
                        style={{ color: getStatusColor(statusResult.status) }}
                      >
                        {statusResult.is_expired ? '🔓' : '🔒'} {statusResult.status}
                      </div>
                      <div className="result-sub">
                        {statusResult.confidence_percent}% model confidence
                      </div>
                    </div>
                    <div className="status-message">
                      {statusResult.is_expired ? (
                        <div className="status-alert expired">
                          ✅ Generic alternatives may already be available!
                          Check pharmacies for cheaper options.
                        </div>
                      ) : (
                        <div className="status-alert active">
                          ⏳ Patent still active. Generic launch expected after expiry.
                          Start planning ahead!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Savings Estimate Card */}
                {expiryResult && (
                  <div className="result-card savings-card">
                    <div className="result-card-header">
                      <span className="result-icon">💰</span>
                      <h3>Expected Savings on Generic</h3>
                    </div>
                    <div className="result-main">
                      <div className="savings-percent">
                        {getSavingsEstimate(category)}
                      </div>
                      <div className="result-sub">estimated cost reduction</div>
                    </div>
                    <div className="savings-breakdown">
                      <div className="savings-row">
                        <span>Category</span>
                        <span>{category}</span>
                      </div>
                      <div className="savings-row">
                        <span>Generic launch (est.)</span>
                        <span>~6 months post-expiry</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="disclaimer">
                ⚠️ These are ML model predictions based on historical FDA data, not official FDA information.
                Always consult your pharmacist or physician for medical decisions.
              </p>
            </section>
          )}

          {/* Info Section */}
          <section className="pred-info">
            <h2>How the Prediction Works</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">🌲</div>
                <h4>Random Forest Regressor</h4>
                <p>Predicts patent lifetime in days based on approval year, month, drug type and category using patterns from 500+ historical drug launches.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📈</div>
                <h4>Gradient Boosting Classifier</h4>
                <p>Classifies whether the patent is currently Active or Expired with confidence scoring based on the predicted expiry date.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <h4>78% Accuracy</h4>
                <p>Our models achieve 78% accuracy on test data, with a margin of error of approximately ±2.8 years on patent lifetime predictions.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
