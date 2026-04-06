import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
      
      <main className="home-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Find Cheaper Drug Alternatives</h1>
            <p className="subtitle">
              AI-powered platform to discover generic alternatives and track patent expirations
            </p>
            
            <div className="hero-buttons">
              <button 
                className="primary-btn"
                onClick={() => navigate('/disease-search')}
              >
                Search by Disease
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate('/drug-search')}
              >
                Search by Drug Name
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <h3>40-90%</h3>
              <p>Average savings with generics</p>
            </div>
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Drugs tracked</p>
            </div>
            <div className="stat-card">
              <h3>ML-Powered</h3>
              <p>Patent predictions</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
  <div className="features-container">
    <h2>How It Works</h2>
    <p className="features-subtitle">Four simple steps to start saving on your medications</p>
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">🏥</div>
        <h3>Search by Disease</h3>
        <p>Select your condition and see all available medications with their alternatives</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">💊</div>
        <h3>Find Alternatives</h3>
        <p>Search any drug and find cheaper alternatives with the same active ingredients</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🤖</div>
        <h3>ML Predictions</h3>
        <p>ML model predicts when expensive drugs will have generic alternatives</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">💰</div>
        <h3>Save Money</h3>
        <p>Switch to generics and save up to 90% on prescription costs</p>
      </div>
    </div>
  </div>
</section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Save on Medications?</h2>
          <p>Start searching for alternatives now</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/disease-search')}
          >
            Get Started
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}