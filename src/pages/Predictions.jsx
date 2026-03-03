// src/pages/Predictions.jsx
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import { predictGenericLaunch, getModelInsights } from '../services/api';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Predictions.css';

// ── Fallback mock data (used until Dishita's API is ready) ──
const MOCK_INSIGHTS = {
  model_accuracy: 0.78,
  total_drugs_tracked: 112,
  avg_days_to_launch: 183,
  category_breakdown: [
    { category: 'Cholesterol', count: 22, avg_savings: 85 },
    { category: 'Diabetes', count: 18, avg_savings: 72 },
    { category: 'Blood Pressure', count: 24, avg_savings: 68 },
    { category: 'Blood Thinners', count: 8, avg_savings: 90 },
    { category: 'Respiratory', count: 14, avg_savings: 55 },
    { category: 'Mental Health', count: 16, avg_savings: 63 },
  ],
  upcoming_cliffs: [
    { drug: 'Eliquis', expiry: 'Mar 2026', savings: 87, category: 'Blood Thinners' },
    { drug: 'Xarelto', expiry: 'Jul 2026', savings: 80, category: 'Blood Thinners' },
    { drug: 'Jardiance', expiry: 'Aug 2026', savings: 74, category: 'Diabetes' },
    { drug: 'Ozempic', expiry: 'Nov 2026', savings: 82, category: 'Diabetes' },
    { drug: 'Entresto', expiry: 'Jan 2027', savings: 69, category: 'Heart' },
  ],
  monthly_predictions: [
    { month: 'Jan 26', count: 3, savings_potential: 12 },
    { month: 'Feb 26', count: 5, savings_potential: 28 },
    { month: 'Mar 26', count: 8, savings_potential: 47 },
    { month: 'Apr 26', count: 4, savings_potential: 19 },
    { month: 'May 26', count: 6, savings_potential: 35 },
    { month: 'Jun 26', count: 7, savings_potential: 41 },
    { month: 'Jul 26', count: 11, savings_potential: 63 },
    { month: 'Aug 26', count: 9, savings_potential: 52 },
  ],
};

const CHART_COLORS = ['#667eea', '#764ba2', '#27ae60', '#e67e22', '#e74c3c', '#3498db'];

export default function Predictions() {
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState(false);

  // Test form state
  const [form, setForm] = useState({
    drug_name: '',
    patent_expiry: '',
    category: 'Cholesterol',
  });
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState('');

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await getModelInsights();
      setInsights(data);
    } catch {
      // Dishita's API not running yet — use mock
      setInsights(MOCK_INSIGHTS);
      setInsightsError(true);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!form.drug_name || !form.patent_expiry) {
      setPredError('Please fill in all fields');
      return;
    }
    setPredicting(true);
    setPredError('');
    setPrediction(null);

    try {
      const result = await predictGenericLaunch(form);
      setPrediction(result);
    } catch {
      // Mock prediction while Flask isn't running
      const mockDays = Math.floor(Math.random() * 120) + 150;
      const launch = new Date(form.patent_expiry);
      launch.setDate(launch.getDate() + mockDays);
      setPrediction({
        drug_name: form.drug_name,
        predicted_launch_date: launch.toISOString().split('T')[0],
        confidence: (Math.random() * 0.2 + 0.7).toFixed(2),
        predicted_price_drop: Math.floor(Math.random() * 30) + 60,
        days_until_generic: mockDays,
      });
      setPredError('⚠️ Using mock prediction — connect Dishita\'s Flask API for real results');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="predictions-page">
      <Header />

      <main className="predictions-content">

        {/* ── Page Header ── */}
        <div className="pred-page-header">
          <div className="pred-header-text">
            <span className="pred-label">AI-Powered</span>
            <h1>Generic Drug Predictions</h1>
            <p>Dishita's Random Forest model predicts when brand-name drugs will have cheaper generic alternatives</p>
          </div>
          <div className="model-accuracy-badge">
            <div className="accuracy-ring">
              <span className="accuracy-value">{insights ? Math.round(insights.model_accuracy * 100) : '--'}%</span>
              <span className="accuracy-label">Model Accuracy</span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        {insights && (
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-num">{insights.total_drugs_tracked}</span>
              <span className="stat-desc">Drugs Tracked</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{insights.avg_days_to_launch}d</span>
              <span className="stat-desc">Avg Days to Generic Launch</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{insights.upcoming_cliffs?.length}</span>
              <span className="stat-desc">Upcoming Patent Cliffs</span>
            </div>
            <div className="stat-box highlight">
              <span className="stat-num">$50B+</span>
              <span className="stat-desc">Estimated Patient Savings</span>
            </div>
          </div>
        )}

        {insightsError && (
          <div className="api-warning">
            ⚠️ Showing mock data — Dishita's Flask API at <code>localhost:8000</code> is not running yet
          </div>
        )}

        <div className="predictions-grid">

          {/* ── LEFT: Test the Model ── */}
          <section className="pred-card test-card">
            <div className="card-header">
              <h2>🧪 Test the Model</h2>
              <p>Enter a drug's details to get a generic launch prediction</p>
            </div>

            <form onSubmit={handlePredict} className="pred-form">
              <div className="pred-form-group">
                <label>Drug Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eliquis, Ozempic"
                  value={form.drug_name}
                  onChange={e => setForm({ ...form, drug_name: e.target.value })}
                  className="pred-input"
                />
              </div>

              <div className="pred-form-group">
                <label>Patent Expiry Date</label>
                <input
                  type="date"
                  value={form.patent_expiry}
                  onChange={e => setForm({ ...form, patent_expiry: e.target.value })}
                  className="pred-input"
                />
              </div>

              <div className="pred-form-group">
                <label>Drug Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="pred-input"
                >
                  {['Cholesterol', 'Diabetes', 'Blood Pressure', 'Blood Thinners',
                    'Respiratory', 'Mental Health', 'Heart', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {predError && <p className="pred-error">{predError}</p>}

              <button type="submit" className="pred-submit-btn" disabled={predicting}>
                {predicting ? <><span className="btn-spin" /> Predicting...</> : '🤖 Run Prediction'}
              </button>
            </form>

            {/* Prediction Result */}
            {prediction && (
              <div className="prediction-result">
                <div className="result-header">
                  <span className="result-drug">{prediction.drug_name}</span>
                  <span className="result-confidence">
                    {Math.round(prediction.confidence * 100)}% confident
                  </span>
                </div>

                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">Predicted Launch</span>
                    <span className="result-value green">
                      {new Date(prediction.predicted_launch_date).toLocaleDateString('en-US', {
                        month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Days Until Generic</span>
                    <span className="result-value blue">{prediction.days_until_generic} days</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Expected Price Drop</span>
                    <span className="result-value purple">{prediction.predicted_price_drop}%</span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="confidence-bar-wrap">
                  <span>Model Confidence</span>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                  <span>{Math.round(prediction.confidence * 100)}%</span>
                </div>
              </div>
            )}
          </section>

          {/* ── RIGHT: Upcoming Patent Cliffs ── */}
          <section className="pred-card cliff-card">
            <div className="card-header">
              <h2>📅 Upcoming Patent Cliffs</h2>
              <p>High-savings drugs expiring in 2026–2027</p>
            </div>
            <div className="cliff-list">
              {insights?.upcoming_cliffs?.map((drug, i) => (
                <div key={i} className="cliff-item">
                  <div className="cliff-left">
                    <span className="cliff-name">{drug.drug}</span>
                    <span className="cliff-category">{drug.category}</span>
                  </div>
                  <div className="cliff-right">
                    <span className="cliff-expiry">{drug.expiry}</span>
                    <div className="cliff-savings-bar">
                      <div
                        className="cliff-savings-fill"
                        style={{ width: `${drug.savings}%` }}
                      />
                    </div>
                    <span className="cliff-savings-pct">{drug.savings}% savings</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CHART 1: Monthly Predictions Timeline ── */}
          <section className="pred-card chart-card wide">
            <div className="card-header">
              <h2>📈 Generic Launch Timeline</h2>
              <p>Number of generics predicted to launch per month</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={insights?.monthly_predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Predicted Launches"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings_potential"
                  name="Savings Potential ($B)"
                  stroke="#27ae60"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#27ae60', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* ── CHART 2: Savings by Drug Category ── */}
          <section className="pred-card chart-card">
            <div className="card-header">
              <h2>💊 Avg Savings by Category</h2>
              <p>Expected price drop % when generics launch</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={insights?.category_breakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{ borderRadius: 10 }}
                />
                <Bar dataKey="avg_savings" name="Avg Savings %" radius={[0, 6, 6, 0]}>
                  {insights?.category_breakdown?.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* ── CHART 3: Drug Count by Category (Pie) ── */}
          <section className="pred-card chart-card">
            <div className="card-header">
              <h2>🥧 Drugs by Category</h2>
              <p>Distribution of tracked drugs</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={insights?.category_breakdown}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {insights?.category_breakdown?.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [`${v} drugs`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}