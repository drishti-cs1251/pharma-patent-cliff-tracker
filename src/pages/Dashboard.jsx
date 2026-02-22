// pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getUserProfile, getSavedDrugs } from '../services/api';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [savedDrugs, setSavedDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      
      const drugs = await getSavedDrugs();
      setSavedDrugs(drugs);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="loading">Loading your dashboard...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />
      
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.email}!</h1>
          <p>Manage your medications and alerts</p>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-section">
            <h2>My Saved Drugs</h2>
            {savedDrugs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't saved any drugs yet.</p>
                <p>Search for drugs to start tracking!</p>
              </div>
            ) : (
              <div className="drugs-list">
                {savedDrugs.map((drug) => (
                  <div key={drug.id} className="drug-card">
                    <h3>{drug.brand_name}</h3>
                    <p className="generic-name">{drug.generic_name}</p>
                    <div className="drug-info">
                      <span className="patent-status">
                        {drug.patent_status}
                      </span>
                      <span className="savings">
                        Save ${drug.potential_savings}/year
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Active Alerts</h2>
            <div className="empty-state">
              <p>No active alerts yet.</p>
              <p>Set up alerts for your medications to get notified!</p>
            </div>
          </section>

          <section className="dashboard-section full-width">
            <h2>Potential Savings</h2>
            <div className="savings-summary">
              <div className="savings-card">
                <h3>$0</h3>
                <p>Monthly Savings</p>
              </div>
              <div className="savings-card">
                <h3>$0</h3>
                <p>Annual Savings</p>
              </div>
              <div className="savings-card">
                <h3>0</h3>
                <p>Drugs Tracked</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}