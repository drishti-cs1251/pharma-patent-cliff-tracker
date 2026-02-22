// pages/Home.jsx
/*import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
      
      <main className="home-content">
        <section className="hero">
          <h1>Stop Overpaying for Prescription Drugs</h1>
          <p className="subtitle">
            Track patent expirations and discover generic alternatives
          </p>
          
          <div className="cta-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>

          <div className="stats">
            <div className="stat-card">
              <h3>$5,940</h3>
              <p>Average annual savings per user</p>
            </div>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Drugs tracked</p>
            </div>
            <div className="stat-card">
              <h3>90%</h3>
              <p>Average price drop after generic launch</p>
            </div>
          </div>

          
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search Your Medication</h3>
              <p>Find your prescription drug in our database</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Check Patent Status</h3>
              <p>See when the patent expires and generics become available</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Alerted</h3>
              <p>Receive notifications when generic versions launch</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Save Money</h3>
              <p>Switch to generics and save thousands per year</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}*/
// pages/Home.jsx
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
              <h3>90%</h3>
              <p>Average savings with generics</p>
            </div>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Drugs tracked</p>
            </div>
            <div className="stat-card">
              <h3>AI-Powered</h3>
              <p>Patent predictions</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>How It Works</h2>
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
              <h3>AI Predictions</h3>
              <p>ML model predicts when expensive drugs will have generic alternatives</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Save Money</h3>
              <p>Switch to generics and save up to 90% on prescription costs</p>
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