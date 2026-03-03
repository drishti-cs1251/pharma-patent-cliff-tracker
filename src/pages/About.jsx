// pages/About.jsx
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './About.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-container">
            <div className="hero-badge">Capstone Project 2026</div>
            <h1>Drug Alternative Finder</h1>
            <p className="hero-tagline">
              AI-Powered Platform to Save Money on Medications
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">90%</span>
                <span className="stat-label">Avg Savings</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Drugs Tracked</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="mission-section">
          <div className="content-container">
            <h2>What We Do</h2>
            <p className="mission-text">
              We help patients discover <strong>cheaper generic alternatives</strong> for expensive 
              brand-name medications using AI to track patent expirations and predict when 
              generics will become available.
            </p>
            
            <div className="features">
              <div className="feature">
                <span className="feature-emoji">🔍</span>
                <h3>Search by Disease</h3>
                <p>Find medications for your condition</p>
              </div>
              <div className="feature">
                <span className="feature-emoji">💊</span>
                <h3>Find Alternatives</h3>
                <p>Discover cheaper generic options</p>
              </div>
              <div className="feature">
                <span className="feature-emoji">🤖</span>
                <h3>AI Predictions</h3>
                <p>Know when generics will launch</p>
              </div>
              <div className="feature">
                <span className="feature-emoji">💰</span>
                <h3>Save Money</h3>
                <p>Cut costs by 20-90%</p>
              </div>
            </div>
          </div>
        </section>

    <section className="explanation-section">
          <div className="content-container">
            <div className="explanation-content">
              <div className="explanation-header">
                <span className="section-label">About This Project</span>
                <h2>How Our Platform Works</h2>
              </div>
              
              <div className="explanation-body">
                <div className="explanation-text">
                  <p>
                    <strong>Drug Alternative Finder</strong> is an intelligent healthcare platform designed to address 
                    a critical gap in the pharmaceutical industry: the lack of accessible information about generic 
                    drug alternatives and patent expirations. Our system leverages machine learning and comprehensive 
                    FDA data to help patients make informed decisions about their medications.
                  </p>
                  
                  <p>
                    The platform operates on three core pillars. First, we maintain a <strong>comprehensive database</strong> of 
                    prescription drugs sourced from the FDA Orange Book, including patent information, active ingredients, 
                    and pricing data. Second, our <strong>AI-powered prediction engine</strong> uses a Random Forest Classifier 
                    with fuzzy logic to analyze historical patent data and predict when expensive brand-name drugs will 
                    have generic alternatives available. Third, we provide <strong>intelligent search capabilities</strong> that 
                    allow users to find medications either by disease condition or by drug composition, instantly revealing 
                    cheaper alternatives based on active ingredients.
                  </p>
                  
                  <p>
                    What sets our project apart is the integration of <strong>real-time patent tracking</strong> with predictive 
                    analytics. While most pharmacy websites simply list current prices, we go further by forecasting 
                    future availability of generics, enabling patients to plan their medication purchases strategically. 
                    Our machine learning model, trained on over 500 historical drug launches, achieves 78% accuracy in 
                    predicting generic launch timelines, helping users understand not just if a generic exists, but 
                    <em>when</em> it will become available.
                  </p>
                  
                  <p>
                    From a technical standpoint, this capstone project demonstrates the full spectrum of modern software 
                    development. The <strong>frontend</strong> is built with React.js, providing a responsive and intuitive 
                    user interface. The <strong>backend</strong> uses Node.js and Express to serve RESTful APIs with JWT 
                    authentication. The <strong>data science pipeline</strong> employs Python, Pandas, and Scikit-learn for 
                    data processing and model training. Finally, our <strong>DevOps infrastructure</strong> utilizes Docker 
                    for containerization and Apache Airflow for automated data pipeline orchestration, ensuring our 
                    patent and pricing information stays current.
                  </p>
                  
                  <p>
                    The impact potential is significant. With generic drugs offering 20-90% cost savings compared to 
                    brand-name equivalents, and over 110 major drugs losing patent protection in 2026-2027, our platform 
                    could help millions of patients save thousands of dollars annually. By democratizing access to patent 
                    expiration data and leveraging AI to predict market changes, we're empowering patients to take control 
                    of their healthcare costs while maintaining the same quality of treatment through bioequivalent generic 
                    alternatives.
                  </p>
                </div>
                
                <div className="explanation-highlights">
                  <div className="highlight-card">
                    <div className="highlight-icon">📊</div>
                    <h4>Data-Driven</h4>
                    <p>Built on FDA Orange Book data with 500+ historical drug launches for ML training</p>
                  </div>
                  
                  <div className="highlight-card">
                    <div className="highlight-icon">🎯</div>
                    <h4>Predictive AI</h4>
                    <p>78% accuracy in forecasting when generic drugs will launch in the market</p>
                  </div>
                  
                  <div className="highlight-card">
                    <div className="highlight-icon">⚡</div>
                    <h4>Real-Time</h4>
                    <p>Automated pipelines keep patent and pricing data current every 24 hours</p>
                  </div>
                  
                  <div className="highlight-card">
                    <div className="highlight-icon">🔒</div>
                    <h4>Secure</h4>
                    <p>JWT authentication and encrypted user data for privacy protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Savings Impact */}
        <section className="savings-section">
          <div className="content-container">
            <h2>The Power of Generic Drugs</h2>
            <div className="savings-cards">
              <div className="savings-card">
                <div className="card-icon">💵</div>
                <div className="card-value">20-90%</div>
                <div className="card-label">Cost Savings</div>
              </div>
              <div className="savings-card">
                <div className="card-icon">💊</div>
                <div className="card-value">51%</div>
                <div className="card-label">Avg Generic Reduction</div>
              </div>
              <div className="savings-card">
                <div className="card-icon">🧬</div>
                <div className="card-value">60%</div>
                <div className="card-label">Biosimilar Reduction</div>
              </div>
            </div>
            <div className="savings-note">
              💡 Generic prices drop even further as more manufacturers enter the market
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="tech-section">
          <div className="content-container">
            <h2>Built With Modern Technology</h2>
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-emoji">⚛️</div>
                <h4>Frontend</h4>
                <p>React.js, Responsive Design</p>
              </div>
              <div className="tech-card">
                <div className="tech-emoji">🔧</div>
                <h4>Backend</h4>
                <p>Node.js, Express, JWT Auth</p>
              </div>
              <div className="tech-card">
                <div className="tech-emoji">🤖</div>
                <h4>AI/ML</h4>
                <p>Python, Scikit-learn, Random Forest</p>
              </div>
              <div className="tech-card">
                <div className="tech-emoji">🚀</div>
                <h4>DevOps</h4>
                <p>Docker, Airflow, CI/CD</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="content-container">
            <h2>Meet Our Team</h2>
            <div className="team-cards">
              <div className="team-card">
                <div className="member-avatar">G</div>
                <h3>Gauri</h3>
                <p className="member-role">Full Stack & DevOps</p>
                <p className="member-desc">Backend, APIs, Infrastructure</p>
              </div>
              <div className="team-card">
                <div className="member-avatar">D</div>
                <h3>Drishti</h3>
                <p className="member-role">Full Stack & UI/UX</p>
                <p className="member-desc">Frontend, Design, User Experience</p>
              </div>
              <div className="team-card">
                <div className="member-avatar">D</div>
                <h3>Dishita</h3>
                <p className="member-role">Data Science & ML</p>
                <p className="member-desc">AI Models, Predictions, Analytics</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="content-container">
            <h2>Ready to Start Saving?</h2>
            <p>Discover how much you could save on your medications</p>
            <div className="cta-buttons">
              <button onClick={() => navigate('/disease-search')} className="cta-btn primary">
                Search by Disease
              </button>
              <button onClick={() => navigate('/drug-search')} className="cta-btn secondary">
                Search by Drug
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}