// pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {
  getWatchlist,
  addWatchlistEntry,
  removeWatchlistEntry,
  getAlerts,
  markAlertRead,
  dismissAlert,
  searchDrugs,
} from '../services/api';
import './Dashboard.css';

// ── Static: next-10-expiring from full drug universe ─────────────────────────
// In production: GET /api/drugs/expiring-soon?limit=10
const NEXT_10_EXPIRING = [
  { drug: 'ELIQUIS',    generic: 'Apixaban',              expiry: '2026-04-15', category: 'Blood Thinner', days: 15  },
  { drug: 'XARELTO',   generic: 'Rivaroxaban',            expiry: '2026-05-22', category: 'Anticoagulant', days: 52  },
  { drug: 'TRULICITY', generic: 'Dulaglutide',            expiry: '2026-06-10', category: 'Diabetes',      days: 71  },
  { drug: 'OZEMPIC',   generic: 'Semaglutide',            expiry: '2026-07-04', category: 'Diabetes',      days: 95  },
  { drug: 'BRILINTA',  generic: 'Ticagrelor',             expiry: '2026-08-18', category: 'Heart',         days: 140 },
  { drug: 'ENTRESTO',  generic: 'Sacubitril/Valsartan',   expiry: '2026-09-01', category: 'Heart Failure', days: 154 },
  { drug: 'JANUVIA',   generic: 'Sitagliptin',            expiry: '2026-09-20', category: 'Diabetes',      days: 173 },
  { drug: 'INVOKANA',  generic: 'Canagliflozin',          expiry: '2026-11-05', category: 'Diabetes',      days: 219 },
  { drug: 'JARDIANCE', generic: 'Empagliflozin',          expiry: '2026-12-14', category: 'Diabetes',      days: 258 },
  { drug: 'ADVAIR',    generic: 'Fluticasone/Salmeterol', expiry: '2027-01-10', category: 'Respiratory',   days: 285 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const TODAY = new Date();

function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - TODAY) / 86400000);
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function urgencyLabel(days) {
  if (days <= 30)  return { label: `${days}d left`,          cls: 'badge-critical' };
  if (days <= 90)  return { label: `${days}d left`,          cls: 'badge-high'     };
  if (days <= 180) return { label: `${days}d left`,          cls: 'badge-medium'   };
  return               { label: `${Math.ceil(days/30)}mo`, cls: 'badge-low'      };
}

const ALERT_STYLE = {
  '30-day':           { icon: '🚨', border: '#ef4444', bg: '#fff5f5', tag: '30-day alert'   },
  '90-day':           { icon: '⚠️', border: '#f59e0b', bg: '#fffbeb', tag: '90-day alert'   },
  '180-day':          { icon: '📅', border: '#667eea', bg: '#eff6ff', tag: '6-month notice' },
  '365-day':          { icon: '💡', border: '#10b981', bg: '#f0fdf4', tag: '1-year notice'  },
  'generic_available':{ icon: '🎉', border: '#10b981', bg: '#f0fdf4', tag: 'Generic Live!'  },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, sub, accent }) {
  return (
    <div className="db-stat" style={{ '--acc': accent }}>
      <span className="db-stat-icon">{icon}</span>
      <div>
        <div className="db-stat-val">{value}</div>
        <div className="db-stat-lbl">{label}</div>
        {sub && <div className="db-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function WatchlistCard({ drug, onRemove }) {
  const days = daysUntil(drug.patent_expiry);
  const isExpired = days < 0;
  const { label, cls } = urgencyLabel(Math.max(0, days));
  const urgCls = days <= 30 ? 'wl-critical' : days <= 90 ? 'wl-high' : days <= 180 ? 'wl-medium' : 'wl-low';

  return (
    <div className={`wl-card ${urgCls}`}>
      <div className="wl-card-head">
        <div>
          <div className="wl-brand">{drug.drug_name}</div>
          <div className="wl-generic">{drug.generic_name} · {drug.dosage_form}</div>
          <span className="wl-cat">{drug.category}</span>
        </div>
        <button className="wl-remove" onClick={() => onRemove(drug.id)}>×</button>
      </div>

      <div className="wl-expiry-row">
        <div>
          <div className="wl-expiry-lbl">Patent Expiry</div>
          <div className="wl-expiry-val">{fmtDate(drug.patent_expiry)}</div>
        </div>
        {isExpired
          ? <span className="badge-generic">✅ Generic Available</span>
          : <span className={`urg-badge ${cls}`}>{label}</span>
        }
      </div>

      {!isExpired && (
        <div className="wl-progress">
          <div className="wl-prog-track">
            <div className="wl-prog-fill" style={{ width: `${Math.max(4, Math.min(100, (1 - days / 1460) * 100))}%` }} />
          </div>
          <span className="wl-prog-note">Closer to expiry →</span>
        </div>
      )}

      <div className="wl-alert-note">
        📧 Email alerts set for 365d, 180d, 90d &amp; 30d before expiry
      </div>
    </div>
  );
}

function AlertItem({ alert, onDismiss, onRead }) {
  const style = ALERT_STYLE[alert.alert_type] || ALERT_STYLE['365-day'];
  return (
    <div
      className={`alert-item ${alert.read ? 'alert-read' : 'alert-unread'}`}
      style={{ borderLeftColor: style.border, background: style.bg }}
      onClick={() => !alert.read && onRead(alert.id)}
    >
      <span className="alert-ico">{style.icon}</span>
      <div className="alert-content">
        <div className="alert-meta-row">
          <span className="alert-drug">{alert.drug_name}</span>
          <span className="alert-tag" style={{ color: style.border }}>{style.tag}</span>
          {!alert.read && <span className="alert-dot" />}
        </div>
        <p className="alert-msg">{alert.message}</p>
        <span className="alert-date">{fmtDate(alert.created_at)}</span>
      </div>
      <button className="alert-x" onClick={(e) => { e.stopPropagation(); onDismiss(alert.id); }}>×</button>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const userEmail    = user?.email || localStorage.getItem('userEmail') || 'user@example.com';
  const userName     = user?.name  || userEmail.split('@')[0];

  const [watchlist,  setWatchlist]  = useState([]);
  const [alerts,     setAlerts]     = useState([]);
  const [activeTab,  setActiveTab]  = useState('overview');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Add-drug modal state
  const [addOpen,    setAddOpen]    = useState(false);
  const [addQuery,   setAddQuery]   = useState('');
  const [addResults, setAddResults] = useState([]);
  const [adding,     setAdding]     = useState(false);

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [wlRes, alRes] = await Promise.all([getWatchlist(), getAlerts()]);
      setWatchlist(wlRes.data  ?? []);
      setAlerts(alRes.data     ?? []);
    } catch (err) {
      console.error('[Dashboard] load error:', err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ── Computed stats ────────────────────────────────────────────────────────
  const unread         = alerts.filter(a => !a.read).length;
  const expiringSoon   = watchlist.filter(d => { const dy = daysUntil(d.patent_expiry); return dy > 0 && dy <= 180; }).length;
  const alreadyExpired = watchlist.filter(d => daysUntil(d.patent_expiry) < 0).length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRemove = async (id) => {
    // Optimistic update
    setWatchlist(p => p.filter(d => d.id !== id));
    try {
      await removeWatchlistEntry(id);
    } catch (err) {
      console.error('[Watchlist] remove error:', err);
      loadDashboard(); // revert on failure
    }
  };

  const handleDismissAlert = async (id) => {
    setAlerts(p => p.filter(a => a.id !== id));
    try {
      await dismissAlert(id);
    } catch (err) {
      console.error('[Alerts] dismiss error:', err);
      loadDashboard();
    }
  };

  const handleReadAlert = async (id) => {
    setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));
    try {
      await markAlertRead(id);
    } catch (err) {
      console.error('[Alerts] mark-read error:', err);
    }
  };

  // Search uses the real drug search API, falling back to NEXT_10_EXPIRING locally
  const handleAddSearch = async (q) => {
    setAddQuery(q);
    if (!q.trim()) { setAddResults([]); return; }

    // Quick local filter first for instant feedback
    const local = NEXT_10_EXPIRING.filter(d =>
      d.drug.toLowerCase().includes(q.toLowerCase()) ||
      d.generic.toLowerCase().includes(q.toLowerCase())
    );
    setAddResults(local);

    // Also hit the real drug search endpoint
    try {
      const res = await searchDrugs(q);
      if (res.data?.length) {
        // Map API results to the same shape NEXT_10_EXPIRING uses
        const remote = res.data.map(d => ({
          drug:     d.brand_name?.toUpperCase() || d.generic_name?.toUpperCase(),
          generic:  d.generic_name,
          expiry:   d.patent_expiry_date,
          category: d.category || 'Pharmaceutical',
          days:     daysUntil(d.patent_expiry_date),
          dosage_form: d.dosage_form || 'See drug label',
        })).filter(d => d.expiry); // guard against missing expiry
        setAddResults(prev => {
          // Merge: remote results first, then local ones not already present
          const remoteNames = new Set(remote.map(r => r.drug));
          return [...remote, ...prev.filter(p => !remoteNames.has(p.drug))];
        });
      }
    } catch {
      // Silently fall back to the local results already shown
    }
  };

  const handleAddDrug = async (item) => {
    if (watchlist.find(d => d.drug_name === item.drug)) return;
    setAdding(true);
    try {
      const res = await addWatchlistEntry({
        drug_name:     item.drug,
        generic_name:  item.generic,
        patent_expiry: item.expiry,
        dosage_form:   item.dosage_form || 'See drug label',
        category:      item.category,
      });
      setWatchlist(p => [...p, res.data]);
      setAddOpen(false);
      setAddQuery('');
      setAddResults([]);
    } catch (err) {
      console.error('[Watchlist] add error:', err);
      alert('Failed to add drug to watchlist. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  // ── Loading / Error screens ───────────────────────────────────────────────
  if (loading) return (
    <div className="db-page">
      <Header />
      <div className="db-loader"><div className="db-spin" /><p>Loading your dashboard…</p></div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="db-page">
      <Header />
      <div className="db-loader">
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button className="db-add-btn" onClick={loadDashboard} style={{ marginTop: 12 }}>Retry</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="db-page">
      <Header />
      <main className="db-main">

        {/* ── Welcome Banner ──────────────────────────────────────── */}
        <div className="db-welcome">
          <div className="db-welcome-left">
            <div className="db-avatar">{userName[0].toUpperCase()}</div>
            <div>
              <h1 className="db-welcome-h1">Welcome back, {userName}!</h1>
              <p className="db-welcome-sub">📧 Alerts sent to <strong>{userEmail}</strong></p>
            </div>
          </div>
          <div className="db-welcome-right">
            {unread > 0 && (
              <button className="db-notif-pill" onClick={() => setActiveTab('alerts')}>
                🔔 {unread} new alert{unread > 1 ? 's' : ''}
              </button>
            )}
            <button className="db-predict-btn" onClick={() => navigate('/predict')}>
              🔮 Predict Patent Expiry
            </button>
            <button className="db-add-btn" onClick={() => setAddOpen(true)}>
              + Watch a Drug
            </button>
          </div>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="db-stats">
          <StatCard icon="👁️" value={watchlist.length}  label="Drugs Watched"      sub="in your list"    accent="#667eea" />
          <StatCard icon="⏰" value={expiringSoon}       label="Expiring in 6mo"    sub="act soon"        accent="#ef4444" />
          <StatCard icon="✅" value={alreadyExpired}     label="Generics Available" sub="switch & save"   accent="#10b981" />
          <StatCard icon="🔔" value={unread}             label="Unread Alerts"      sub="check email too" accent="#f59e0b" />
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div className="db-tabs">
          {[
            { id: 'overview',  label: '🏠 Overview'                                },
            { id: 'watchlist', label: `💊 My Watchlist (${watchlist.length})`      },
            { id: 'expiring',  label: '⏳ Next 10 Expiring'                        },
            { id: 'alerts',    label: `🔔 Alerts${unread ? ` (${unread})` : ''}`   },
          ].map(t => (
            <button key={t.id}
              className={`db-tab ${activeTab === t.id ? 'db-tab-active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="db-tab-content">
            <div className="ov-grid">

              {/* Soonest expirations from watchlist */}
              <div className="db-panel">
                <div className="db-panel-head">
                  <h2>⏳ Your Soonest Expirations</h2>
                  <button className="db-panel-link" onClick={() => setActiveTab('watchlist')}>Manage →</button>
                </div>
                {watchlist.length === 0
                  ? <p className="db-empty-note">Add drugs to your watchlist to see them here.</p>
                  : <div className="ov-exp-list">
                      {[...watchlist]
                        .sort((a, b) => new Date(a.patent_expiry) - new Date(b.patent_expiry))
                        .slice(0, 5)
                        .map(drug => {
                          const days = daysUntil(drug.patent_expiry);
                          const { label, cls } = urgencyLabel(Math.max(0, days));
                          return (
                            <div className="ov-exp-row" key={drug.id}>
                              <div className="ov-exp-dot" />
                              <div className="ov-exp-info">
                                <span className="ov-exp-name">{drug.drug_name}</span>
                                <span className="ov-exp-gen">{drug.generic_name}</span>
                              </div>
                              <div className="ov-exp-right">
                                <span className="ov-exp-date">{fmtDate(drug.patent_expiry)}</span>
                                {days < 0
                                  ? <span className="badge-generic-sm">Generic ✅</span>
                                  : <span className={`urg-badge ${cls}`}>{label}</span>
                                }
                              </div>
                            </div>
                          );
                        })}
                    </div>
                }
              </div>

              {/* Recent alerts preview */}
              <div className="db-panel">
                <div className="db-panel-head">
                  <h2>🔔 Recent Alerts</h2>
                  <button className="db-panel-link" onClick={() => setActiveTab('alerts')}>View all →</button>
                </div>
                {alerts.length === 0
                  ? <p className="db-empty-note">No alerts yet. Add drugs to your watchlist.</p>
                  : <div className="ov-alerts-list">
                      {alerts.slice(0, 3).map(a =>
                        <AlertItem key={a.id} alert={a} onDismiss={handleDismissAlert} onRead={handleReadAlert} />)}
                    </div>
                }
              </div>

              {/* Market snapshot teaser */}
              <div className="db-panel ov-insight-panel">
                <div className="db-panel-head">
                  <h2>📊 Market Snapshot</h2>
                  <button className="db-panel-link" onClick={() => navigate('/eda')}>Full analysis →</button>
                </div>
                <div className="insight-teaser-row">
                  <div className="insight-teaser">
                    <div className="it-big">208</div>
                    <div className="it-lbl">patents expiring in 2025</div>
                    <div className="it-sub">Most in any single year on record</div>
                  </div>
                  <div className="insight-teaser it-accent2">
                    <div className="it-big">157</div>
                    <div className="it-lbl">patents expiring in 2026</div>
                    <div className="it-sub">Including major blockbusters</div>
                  </div>
                </div>
                <p className="insight-note">
                  1,254 drugs tracked across 6 categories · FDA Orange Book data
                </p>
                <div className="insight-cta-row">
                  <button className="icta-btn" onClick={() => navigate('/eda')}>📊 Full Market Analysis</button>
                  <button className="icta-btn icta-predict" onClick={() => navigate('/predict')}>🔮 Predict Expiry</button>
                </div>
              </div>

              {/* Quick actions */}
              <div className="db-panel">
                <div className="db-panel-head"><h2>🚀 Quick Actions</h2></div>
                <div className="quick-grid">
                  {[
                    { icon: '🏥', label: 'Search by Disease', sub: 'Find drugs for a condition',   path: '/disease-search' },
                    { icon: '💊', label: 'Search by Drug',    sub: 'Generics & alternatives',      path: '/drug-search'    },
                    { icon: '🔮', label: 'Predict Expiry',    sub: 'AI patent timeline',           path: '/predict'        },
                    { icon: '📊', label: 'Full Insights',     sub: 'EDA & analytics dashboard',    path: '/eda'            },
                  ].map(q => (
                    <button className="quick-tile" key={q.path} onClick={() => navigate(q.path)}>
                      <span className="qt-icon">{q.icon}</span>
                      <strong>{q.label}</strong>
                      <span>{q.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: MY WATCHLIST
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'watchlist' && (
          <div className="db-tab-content">
            <div className="tab-section-head">
              <div>
                <h2 className="section-h2">💊 My Drug Watchlist</h2>
                <p className="section-p">
                  {watchlist.length} drug{watchlist.length !== 1 ? 's' : ''} tracked ·
                  Email alerts auto-sent at 365d, 180d, 90d &amp; 30d before each expiry to <strong>{userEmail}</strong>
                </p>
              </div>
              <button className="db-add-btn" onClick={() => setAddOpen(true)}>+ Watch a Drug</button>
            </div>

            {watchlist.length === 0 ? (
              <div className="db-empty-big">
                <div className="db-empty-ico">💊</div>
                <h3>Nothing in your watchlist yet</h3>
                <p>Add drugs to track patent expiry and receive automatic email alerts.</p>
                <button className="db-add-btn" onClick={() => setAddOpen(true)}>+ Add Your First Drug</button>
              </div>
            ) : (
              <div className="wl-grid">
                {[...watchlist]
                  .sort((a, b) => new Date(a.patent_expiry) - new Date(b.patent_expiry))
                  .map(drug => <WatchlistCard key={drug.id} drug={drug} onRemove={handleRemove} />)}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: NEXT 10 EXPIRING
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'expiring' && (
          <div className="db-tab-content">
            <div className="tab-section-head">
              <div>
                <h2 className="section-h2">⏳ Next 10 Patent Expirations</h2>
                <p className="section-p">Global view from FDA Orange Book · as of {fmtDate(TODAY)}</p>
              </div>
            </div>

            <div className="exp10-wrap">
              <table className="exp10-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Brand Name</th>
                    <th>Generic (Active Ingredient)</th>
                    <th>Category</th>
                    <th>Expiry Date</th>
                    <th>Time Remaining</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {NEXT_10_EXPIRING.map((item, i) => {
                    const { label, cls } = urgencyLabel(item.days);
                    const inWl = watchlist.some(w => w.drug_name === item.drug);
                    return (
                      <tr key={item.drug} className={i < 3 ? 'row-urgent' : ''}>
                        <td className="exp-rank">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </td>
                        <td><span className="exp-drug-name">{item.drug}</span></td>
                        <td className="exp-generic">{item.generic}</td>
                        <td><span className="exp-cat">{item.category}</span></td>
                        <td className="exp-date">{fmtDate(item.expiry)}</td>
                        <td><span className={`urg-badge ${cls}`}>{label}</span></td>
                        <td>
                          {inWl
                            ? <span className="exp-watching">👁️ Watching</span>
                            : <button className="exp-watch-btn" onClick={() => handleAddDrug(item)} disabled={adding}>+ Watch</button>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="exp10-footer">
              <span>💡 Click <strong>+ Watch</strong> to add to your watchlist and get email alerts.</span>
              <button className="icta-btn" onClick={() => navigate('/eda')}>View full expiry calendar →</button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: ALERTS
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'alerts' && (
          <div className="db-tab-content">
            <div className="tab-section-head">
              <div>
                <h2 className="section-h2">🔔 Patent Expiry Alerts</h2>
                <p className="section-p">
                  {alerts.length} alert{alerts.length !== 1 ? 's' : ''} · {unread} unread ·
                  Emails delivered to <strong>{userEmail}</strong>
                </p>
              </div>
              {alerts.length > 0 && (
                <button className="db-clear-btn" onClick={() => {
                  Promise.all(alerts.map(a => dismissAlert(a.id))).catch(console.error);
                  setAlerts([]);
                }}>Clear All</button>
              )}
            </div>

            <div className="alert-info-box">
              📧 <strong>How email alerts work:</strong> Our system runs a daily check on all watchlisted drugs.
              When a patent is exactly 365, 180, 90, or 30 days from expiry, an alert email is automatically
              sent to <strong>{userEmail}</strong> and appears here in-app.
            </div>

            {alerts.length === 0 ? (
              <div className="db-empty-big">
                <div className="db-empty-ico">🔔</div>
                <h3>No alerts yet</h3>
                <p>Add drugs to your watchlist — we'll notify you at key milestones before each patent expires.</p>
                <button className="db-add-btn" onClick={() => setActiveTab('watchlist')}>Go to Watchlist</button>
              </div>
            ) : (
              <div className="alerts-full-list">
                {alerts.map(a => <AlertItem key={a.id} alert={a} onDismiss={handleDismissAlert} onRead={handleReadAlert} />)}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── Add Drug Modal ─────────────────────────────────────────── */}
      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>🔍 Watch a Drug</h3>
              <button className="modal-close" onClick={() => setAddOpen(false)}>×</button>
            </div>
            <p className="modal-sub">
              Search a brand or generic name. We'll track its patent expiry and email you alerts automatically.
            </p>
            <input
              className="modal-input"
              placeholder="e.g. Eliquis, Apixaban, Ozempic…"
              value={addQuery}
              onChange={e => handleAddSearch(e.target.value)}
              autoFocus
            />
            {addResults.length > 0 && (
              <div className="modal-results">
                {addResults.map(item => {
                  const inWl = watchlist.some(w => w.drug_name === item.drug);
                  const { label, cls } = urgencyLabel(item.days);
                  return (
                    <div className="modal-result-row" key={item.drug}>
                      <div>
                        <div className="mr-drug">{item.drug}</div>
                        <div className="mr-gen">{item.generic} · {item.category}</div>
                        <div className="mr-expiry">
                          Expires {fmtDate(item.expiry)}
                          <span className={`urg-badge ${cls}`} style={{ marginLeft: 8 }}>{label}</span>
                        </div>
                      </div>
                      {inWl
                        ? <span className="mr-already">✓ Watching</span>
                        : <button className="mr-add-btn" onClick={() => handleAddDrug(item)} disabled={adding}>
                            {adding ? '…' : '+ Add'}
                          </button>
                      }
                    </div>
                  );
                })}
              </div>
            )}
            {addQuery && addResults.length === 0 && (
              <p className="modal-no-results">
                No matches for "{addQuery}".{' '}
                <button className="modal-link" onClick={() => { setAddOpen(false); navigate('/drug-search'); }}>
                  Try full drug search →
                </button>
              </p>
            )}
            <div className="modal-footer">
              Can't find it?{' '}
              <button className="modal-link" onClick={() => { setAddOpen(false); navigate('/drug-search'); }}>
                Search all drugs →
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}