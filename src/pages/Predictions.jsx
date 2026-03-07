// src/pages/PredictionsPage.jsx
// Calls Flask /api/predict-expiry and /api/classify-status

import { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Predictions.css';

const FLASK_URL = import.meta.env.VITE_FLASK_URL || 'http://localhost:5000';

const CATEGORIES = ['Oral', 'Injectable', 'Respiratory', 'Topical', 'Other'];
const APP_TYPES = [
  { value: 'N', label: 'N — New Drug Application (Brand)' },
  { value: 'A', label: 'A — Abbreviated (Generic / ANDA)' },
];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// --- Sub-component: Result Card ---
const PredictionResult = ({ result }) => {
  if (!result) return null;
  const expiry = new Date(result.predicted_expiry_date);
  const today = new Date();
  const daysLeft = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  return (
    <div className={`pred-result ${isExpired ? 'expired' : 'active'}`}>
      <div className="pred-result-header">
        <div className="pred-result-icon">{isExpired ? '⏰' : '📅'}</div>
        <div>
          <div className="pred-result-title">
            {isExpired ? 'Patent Likely Expired' : 'Predicted Expiry Date'}
          </div>
          <div className="pred-result-date">{expiry.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className={`pred-status-badge ${isExpired ? 'badge-expired' : 'badge-active'}`}>
          {isExpired ? 'EXPIRED' : 'ACTIVE'}
        </div>
      </div>

      <div className="pred-result-grid">
        <div className="pred-metric">
          <div className="pred-metric-val">{result.predicted_lifetime_years} yrs</div>
          <div className="pred-metric-label">Predicted Patent Lifetime</div>
        </div>
        <div className="pred-metric">
          <div className="pred-metric-val">{isExpired ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d`}</div>
          <div className="pred-metric-label">{isExpired ? 'Expired' : 'Until Expiry'}</div>
        </div>
        <div className="pred-metric">
          <div className="pred-metric-val">{result.confidence_level}</div>
          <div className="pred-metric-label">Confidence Level</div>
        </div>
        <div className="pred-metric">
          <div className="pred-metric-val">±{Math.round(result.confidence_interval_days / 365 * 10) / 10} yrs</div>
          <div className="pred-metric-label">Margin of Error</div>
        </div>
      </div>

      {!isExpired && (
        <div className="pred-generic-estimate">
          <div className="generic-est-label">🚀 Estimated Generic Availability</div>
          <div className="generic-est-date">
            {new Date(expiry.getTime() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
          <div className="generic-est-sub">~6 months after patent expiry (FDA approval avg)</div>
        </div>
      )}

      {isExpired && (
        <div className="pred-generic-available">
          <div className="ga-icon">✅</div>
          <div>
            <strong>Generic may already be available!</strong>
            <p>This patent appears to have expired. Check your pharmacy or FDA Orange Book for available generics.</p>
          </div>
        </div>
      )}

      <div className="pred-disclaimer">
        ⚠️ {result.note}. Always verify with official FDA data.
      </div>
    </div>
  );
};

// --- Sub-component: Classify Result ---
const ClassifyResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className={`pred-result ${result.is_expired ? 'expired' : 'active'}`}>
      <div className="pred-result-header">
        <div className="pred-result-icon">{result.is_expired ? '⏰' : '✅'}</div>
        <div>
          <div className="pred-result-title">Patent Classification Result</div>
          <div className="pred-result-date">
            Status: <strong>{result.status}</strong>
          </div>
        </div>
        <div className={`pred-status-badge ${result.is_expired ? 'badge-expired' : 'badge-active'}`}>
          {result.status.toUpperCase()}
        </div>
      </div>
      <div className="pred-result-grid">
        <div className="pred-metric">
          <div className="pred-metric-val">{result.confidence_percent}%</div>
          <div className="pred-metric-label">Model Confidence</div>
        </div>
        <div className="pred-metric">
          <div className="pred-metric-val">{result.is_expired ? 'Generic Likely' : 'Brand Protected'}</div>
          <div className="pred-metric-label">Market Implication</div>
        </div>
      </div>
      {result.is_expired && (
        <div className="pred-generic-available">
          <div className="ga-icon">💰</div>
          <div>
            <strong>Savings opportunity detected!</strong>
            <p>This patent is classified as expired — a generic alternative may be available at 20–90% lower cost.</p>
          </div>
        </div>
      )}
      <div className="pred-disclaimer">
        ⚠️ ML classification — verify with FDA Orange Book for official status.
      </div>
    </div>
  );
};

// ============================================================
export default function Predictions() {
  const [activeTab, setActiveTab] = useState('predict');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predict Expiry form state
  const [predictForm, setPredictForm] = useState({
    approval_year: new Date().getFullYear(),
    approval_month: 1,
    app_type: 'N',
    category: 'Oral',
  });
  const [predictResult, setPredictResult] = useState(null);

  // Classify form state
  const today = new Date();
  const [classifyForm, setClassifyForm] = useState({
    expiry_year: today.getFullYear() + 5,
    expiry_month: today.getMonth() + 1,
    expiry_day: today.getDate(),
    patent_lifetime_days: 7300,
    days_from_today: 1825,
  });
  const [classifyResult, setClassifyResult] = useState(null);

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictResult(null);

    try {
      const res = await fetch(`${FLASK_URL}/api/predict-expiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_year: parseInt(predictForm.approval_year),
          approval_month: parseInt(predictForm.approval_month),
          app_type: predictForm.app_type,
          category: predictForm.category,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Prediction failed');
      setPredictResult(data.prediction);
    } catch (err) {
      setError(`Could not reach Flask ML backend: ${err.message}. Make sure Flask is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClassifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setClassifyResult(null);

    // Auto-calc days_from_today from expiry date
    const expiry = new Date(classifyForm.expiry_year, classifyForm.expiry_month - 1, classifyForm.expiry_day);
    const daysFromToday = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

    try {
      const res = await fetch(`${FLASK_URL}/api/classify-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiry_year: parseInt(classifyForm.expiry_year),
          expiry_month: parseInt(classifyForm.expiry_month),
          expiry_day: parseInt(classifyForm.expiry_day),
          patent_lifetime_days: parseInt(classifyForm.patent_lifetime_days),
          days_from_today: daysFromToday,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Classification failed');
      setClassifyResult(data.result);
    } catch (err) {
      setError(`Could not reach Flask ML backend: ${err.message}. Make sure Flask is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pred-page">
      <Header />

      <main className="pred-main">
        {/* Hero */}
        <div className="pred-hero">
          <div className="pred-hero-badge">🤖 ML-Powered</div>
          <h1 className="pred-title">Patent Predictions</h1>
          <p className="pred-subtitle">
            Two AI models at your service — predict when a patent will expire, or classify if one is already expired
          </p>
          <div className="pred-model-pills">
            <span className="model-pill green">✅ Binary Classifier — 100% accuracy</span>
            <span className="model-pill yellow">📊 Regressor — ±2.83yr MAE</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="pred-how">
          <div className="how-step">
            <div className="how-num">1</div>
            <div>Choose a prediction type below</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">2</div>
            <div>Fill in drug approval details</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">3</div>
            <div>Get instant AI prediction</div>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="how-num">4</div>
            <div>Discover savings potential</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pred-tabs">
          <button
            className={`pred-tab ${activeTab === 'predict' ? 'active' : ''}`}
            onClick={() => { setActiveTab('predict'); setError(null); setPredictResult(null); }}
          >
            📅 Predict Expiry Date
            <span className="tab-sub">Random Forest Regressor</span>
          </button>
          <button
            className={`pred-tab ${activeTab === 'classify' ? 'active' : ''}`}
            onClick={() => { setActiveTab('classify'); setError(null); setClassifyResult(null); }}
          >
            🔍 Classify Patent Status
            <span className="tab-sub">Gradient Boosting Classifier</span>
          </button>
        </div>

        {error && (
          <div className="pred-error">
            <strong>⚠️ Backend Error</strong>
            <p>{error}</p>
            <div className="error-help">
              <strong>To fix:</strong> Run <code>python app.py</code> in your Flask directory, then refresh.
              Make sure <code>VITE_FLASK_URL=http://localhost:5000</code> is in your <code>.env</code>.
            </div>
          </div>
        )}

        <div className="pred-content">

          {/* PREDICT EXPIRY */}
          {activeTab === 'predict' && (
            <div className="pred-two-col">
              <div className="pred-form-card">
                <h2>Predict Patent Expiry</h2>
                <p className="form-desc">Enter drug approval details and our Random Forest model will estimate when the patent will expire.</p>
                <form onSubmit={handlePredictSubmit} className="pred-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Approval Year</label>
                      <input
                        type="number"
                        min="1980"
                        max="2025"
                        value={predictForm.approval_year}
                        onChange={e => setPredictForm(f => ({ ...f, approval_year: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Approval Month</label>
                      <select
                        value={predictForm.approval_month}
                        onChange={e => setPredictForm(f => ({ ...f, approval_month: e.target.value }))}
                      >
                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Application Type</label>
                    <div className="radio-group">
                      {APP_TYPES.map(t => (
                        <label key={t.value} className={`radio-card ${predictForm.app_type === t.value ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="app_type"
                            value={t.value}
                            checked={predictForm.app_type === t.value}
                            onChange={e => setPredictForm(f => ({ ...f, app_type: e.target.value }))}
                          />
                          {t.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Drug Category</label>
                    <div className="cat-grid">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`cat-btn ${predictForm.category === cat ? 'selected' : ''}`}
                          onClick={() => setPredictForm(f => ({ ...f, category: cat }))}
                        >
                          {cat === 'Oral' ? '💊' : cat === 'Injectable' ? '💉' : cat === 'Respiratory' ? '🫁' : cat === 'Topical' ? '🧴' : '📦'} {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="pred-submit-btn" disabled={loading}>
                    {loading ? (
                      <><span className="btn-spinner" /> Running Model...</>
                    ) : (
                      '🔮 Predict Expiry Date'
                    )}
                  </button>
                </form>
              </div>

              <div className="pred-result-col">
                {predictResult ? (
                  <PredictionResult result={predictResult} />
                ) : (
                  <div className="pred-empty">
                    <div className="pred-empty-icon">🔮</div>
                    <p>Fill in the form and click <strong>Predict</strong> to see the ML model's output</p>
                    <div className="pred-example-hint">
                      <strong>Example:</strong> A brand-name oral drug approved in Jan 2015 — the model will estimate its expiry date and flag when a generic could become available.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CLASSIFY STATUS */}
          {activeTab === 'classify' && (
            <div className="pred-two-col">
              <div className="pred-form-card">
                <h2>Classify Patent Status</h2>
                <p className="form-desc">Know the patent expiry date? Our Gradient Boosting classifier determines if it's Active or Expired with high confidence.</p>
                <form onSubmit={handleClassifySubmit} className="pred-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Patent Expiry Year</label>
                      <input
                        type="number"
                        min="2020"
                        max="2045"
                        value={classifyForm.expiry_year}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          const expiry = new Date(val, classifyForm.expiry_month - 1, classifyForm.expiry_day);
                          const dft = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
                          setClassifyForm(f => ({ ...f, expiry_year: val, days_from_today: dft }));
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Month</label>
                      <select
                        value={classifyForm.expiry_month}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          const expiry = new Date(classifyForm.expiry_year, val - 1, classifyForm.expiry_day);
                          const dft = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
                          setClassifyForm(f => ({ ...f, expiry_month: val, days_from_today: dft }));
                        }}
                      >
                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Expiry Day</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={classifyForm.expiry_day}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          const expiry = new Date(classifyForm.expiry_year, classifyForm.expiry_month - 1, val);
                          const dft = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
                          setClassifyForm(f => ({ ...f, expiry_day: val, days_from_today: dft }));
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Patent Lifetime (days)</label>
                    <input
                      type="number"
                      min="365"
                      max="10000"
                      value={classifyForm.patent_lifetime_days}
                      onChange={e => setClassifyForm(f => ({ ...f, patent_lifetime_days: e.target.value }))}
                      required
                    />
                    <span className="field-hint">
                      = {Math.round(classifyForm.patent_lifetime_days / 365 * 10) / 10} years — typical range: 5–20 years (1825–7300 days)
                    </span>
                  </div>

                  <div className="classify-preview">
                    <div className="preview-row">
                      <span>Days from today to expiry:</span>
                      <strong className={classifyForm.days_from_today < 0 ? 'neg' : 'pos'}>
                        {classifyForm.days_from_today > 0 ? `+${classifyForm.days_from_today}` : classifyForm.days_from_today} days
                        {classifyForm.days_from_today < 0 ? ' (already expired)' : ''}
                      </strong>
                    </div>
                  </div>

                  <button type="submit" className="pred-submit-btn classify" disabled={loading}>
                    {loading ? (
                      <><span className="btn-spinner" /> Classifying...</>
                    ) : (
                      '🔍 Classify Patent Status'
                    )}
                  </button>
                </form>
              </div>

              <div className="pred-result-col">
                {classifyResult ? (
                  <ClassifyResult result={classifyResult} />
                ) : (
                  <div className="pred-empty">
                    <div className="pred-empty-icon">🔍</div>
                    <p>Enter the known expiry date of a drug patent and the classifier will determine if it's <strong>Active</strong> or <strong>Expired</strong></p>
                    <div className="pred-example-hint">
                      <strong>Example:</strong> Eliquis patent expires March 2026 — the classifier will determine if generics are now legal to manufacture.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="pred-info-section">
          <h3>About These Models</h3>
          <div className="pred-info-grid">
            <div className="pred-info-card">
              <div className="info-icon">📊</div>
              <h4>Random Forest Regressor</h4>
              <p>Predicts patent lifetime in days from approval metadata. Trained on {1254} FDA-approved drugs. Mean Absolute Error: ±2.83 years.</p>
              <div className="info-badge">predict-expiry endpoint</div>
            </div>
            <div className="pred-info-card">
              <div className="info-icon">🎯</div>
              <h4>Gradient Boosting Classifier</h4>
              <p>Binary classification of Active vs Expired status. Uses expiry date and lifetime days as features. 100% test accuracy.</p>
              <div className="info-badge">classify-status endpoint</div>
            </div>
            <div className="pred-info-card">
              <div className="info-icon">💊</div>
              <h4>Generic Launch Estimate</h4>
              <p>After patent expiry, FDA approval for a generic takes ~180 days on average. We add this to predicted expiry for the earliest possible generic date.</p>
              <div className="info-badge">180-day FDA rule</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
