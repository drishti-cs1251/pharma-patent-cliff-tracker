// pages/About.jsx
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <Header />
      
      <main className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>About Our Project</h1>
            <p className="hero-subtitle">
              AI-Powered Drug Alternative Finder with Patent Expiry Predictions
            </p>
            <p className="hero-description">
              A Capstone Project by Gauri, Drishti & Dishita
            </p>
          </div>
        </section>

        {/* Project Overview */}
        <section className="section white-bg">
          <div className="container">
            <h2 className="section-title">What We Do</h2>
            <p className="lead-text">
              Our platform helps patients and healthcare consumers discover cheaper generic 
              alternatives for expensive brand-name medications by tracking pharmaceutical 
              patent expirations and predicting generic drug availability using machine learning.
            </p>
            
            <div className="features-grid">
              <div className="feature-box">
                <div className="feature-icon">🔍</div>
                <h3>Search by Disease</h3>
                <p>Select your medical condition and discover all available medications with their generic alternatives</p>
              </div>
              
              <div className="feature-box">
                <div className="feature-icon">💊</div>
                <h3>Find Alternatives</h3>
                <p>Search any drug by name or ingredient and find cheaper alternatives based on composition</p>
              </div>
              
              <div className="feature-box">
                <div className="feature-icon">🤖</div>
                <h3>AI Predictions</h3>
                <p>Our ML model uses fuzzy classification to predict when expensive drugs will have generic versions</p>
              </div>
              
              <div className="feature-box">
                <div className="feature-icon">💰</div>
                <h3>Maximize Savings</h3>
                <p>Switch to generic alternatives and save 20-90% on prescription medication costs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Savings Section - NEW */}
        <section className="section savings-section">
          <div className="container">
            <h2 className="section-title">The Power of Generic Drugs</h2>
            <p className="lead-text">
              Generic drugs provide substantial cost savings while maintaining the same 
              quality and efficacy as brand-name medications.
            </p>
            
            <div className="savings-highlights">
              <div className="savings-card primary">
                <div className="savings-icon">💵</div>
                <h3>20-90%</h3>
                <p>Cost savings compared to brand-name drugs</p>
              </div>
              
              <div className="savings-card secondary">
                <div className="savings-icon">💊</div>
                <h3>51%</h3>
                <p>Average cost reduction for chemical generics after launch</p>
              </div>
              
              <div className="savings-card tertiary">
                <div className="savings-icon">🧬</div>
                <h3>60%</h3>
                <p>Average cost reduction for biosimilars vs innovator products</p>
              </div>
            </div>

            <div className="savings-details">
              <h3>Why Are Generic Drugs Cheaper?</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">🔬</div>
                  <h4>Lower R&D Costs</h4>
                  <p>Generic manufacturers don't bear the high research and development costs of creating new drugs</p>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">⚡</div>
                  <h4>Faster Approvals</h4>
                  <p>Relatively easier and quicker regulatory approval processes compared to new drug applications</p>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">🏭</div>
                  <h4>Manufacturing Efficiency</h4>
                  <p>Lower manufacturing costs due to established production processes and economies of scale</p>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">📉</div>
                  <h4>Market Competition</h4>
                  <p>Inter-generic competition drives prices down further as more manufacturers enter the market</p>
                </div>
              </div>

              <div className="savings-note">
                <strong>💡 Important Note:</strong> With the passage of time and entry of new players, 
                the prices of both chemical generics and biosimilars reduce substantially, offering even 
                greater benefits to patients and insurance providers, especially for chronic conditions 
                or high-prevalence diseases.
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="section white-bg">
          <div className="container">
            <h2 className="section-title">The Problem We're Solving</h2>
            <div className="problem-content">
              <div className="problem-text">
                <p className="intro-text">
                  Despite the massive cost savings available through generic drugs, millions of 
                  patients continue to overpay for medications due to lack of information and awareness.
                </p>
                
                <div className="problem-list">
                  <div className="problem-item">
                    <div className="problem-icon">❌</div>
                    <div>
                      <h4>Lack of Awareness</h4>
                      <p>Patients don't know when patents expire and generics become available</p>
                    </div>
                  </div>
                  
                  <div className="problem-item">
                    <div className="problem-icon">❌</div>
                    <div>
                      <h4>Information Gap</h4>
                      <p>Pharmacies don't proactively notify patients of cheaper alternatives</p>
                    </div>
                  </div>
                  
                  <div className="problem-item">
                    <div className="problem-icon">❌</div>
                    <div>
                      <h4>Financial Burden</h4>
                      <p>Chronic disease patients waste thousands of dollars annually on expensive brand-name drugs</p>
                    </div>
                  </div>
                  
                  <div className="problem-item">
                    <div className="problem-icon">❌</div>
                    <div>
                      <h4>Timing Uncertainty</h4>
                      <p>No clear visibility into when patent expirations will trigger price drops</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="problem-stats">
                <div className="stat-item">
                  <h3>$500B+</h3>
                  <p>Annual prescription drug spending in the US</p>
                </div>
                <div className="stat-item">
                  <h3>110+</h3>
                  <p>Major drugs losing patents in 2026-2027</p>
                </div>
                <div className="stat-item">
                  <h3>$1,200+</h3>
                  <p>Average annual savings per patient with generics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="section solution-section">
          <div className="container">
            <h2 className="section-title">Our Solution</h2>
            <p className="lead-text">
              A comprehensive platform combining web development, data science, and DevOps 
              to provide real-time drug alternative recommendations.
            </p>
            
            <div className="solution-flow">
              <div className="flow-step">
                <div className="flow-number">1</div>
                <h4>User Input</h4>
                <p>Search by disease or drug name</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-number">2</div>
                <h4>Data Processing</h4>
                <p>FDA data + ML predictions</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-number">3</div>
                <h4>AI Analysis</h4>
                <p>Predict expiry & alternatives</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-number">4</div>
                <h4>Results</h4>
                <p>Savings opportunities displayed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="section white-bg">
          <div className="container">
            <h2 className="section-title">Technical Architecture</h2>
            
            <div className="tech-stack-grid">
              <div className="tech-stack-card">
                <div className="tech-header">
                  <div className="tech-icon">⚛️</div>
                  <h3>Frontend</h3>
                </div>
                <ul className="tech-list">
                  <li>React.js - Modern UI framework</li>
                  <li>React Router - Client-side routing</li>
                  <li>Axios - API communication</li>
                  <li>Recharts - Data visualizations</li>
                  <li>Responsive & accessible design</li>
                </ul>
              </div>
              
              <div className="tech-stack-card">
                <div className="tech-header">
                  <div className="tech-icon">🔧</div>
                  <h3>Backend</h3>
                </div>
                <ul className="tech-list">
                  <li>Node.js & Express.js</li>
                  <li>RESTful API architecture</li>
                  <li>JWT Authentication</li>
                  <li>JSON data processing</li>
                  <li>ML model integration</li>
                </ul>
              </div>
              
              <div className="tech-stack-card">
                <div className="tech-header">
                  <div className="tech-icon">🤖</div>
                  <h3>Data Science</h3>
                </div>
                <ul className="tech-list">
                  <li>Python & Pandas</li>
                  <li>Scikit-learn ML models</li>
                  <li>Fuzzy classification algorithms</li>
                  <li>Random Forest predictor</li>
                  <li>FDA Orange Book data source</li>
                </ul>
              </div>
              
              <div className="tech-stack-card">
                <div className="tech-header">
                  <div className="tech-icon">🚀</div>
                  <h3>DevOps</h3>
                </div>
                <ul className="tech-list">
                  <li>Docker containerization</li>
                  <li>Apache Airflow pipelines</li>
                  <li>CI/CD automation</li>
                  <li>Monitoring & logging</li>
                  <li>Cloud deployment ready</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Machine Learning Model */}
        <section className="section ml-section">
          <div className="container">
            <h2 className="section-title">Machine Learning Model</h2>
            <p className="lead-text">
              Our AI model uses fuzzy classification to predict patent expiry outcomes 
              and generic drug launch timelines with high accuracy.
            </p>
            
            <div className="ml-features">
              <div className="ml-feature">
                <h4>📊 Training Data</h4>
                <p>500+ historical drug patent expirations and generic launches</p>
              </div>
              <div className="ml-feature">
                <h4>🎯 Model Type</h4>
                <p>Random Forest Classifier with fuzzy logic</p>
              </div>
              <div className="ml-feature">
                <h4>✅ Accuracy</h4>
                <p>78% accuracy in predicting generic launch timelines</p>
              </div>
              <div className="ml-feature">
                <h4>📈 Data Split</h4>
                <p>70% training, 15% validation, 15% testing</p>
              </div>
            </div>

            <div className="ml-predictions">
              <h3>What Our Model Predicts:</h3>
              <div className="predictions-grid">
                <div className="prediction-item">
                  <span className="prediction-icon">📅</span>
                  <p>Patent expiry dates for drugs</p>
                </div>
                <div className="prediction-item">
                  <span className="prediction-icon">🚀</span>
                  <p>Generic drug launch timelines</p>
                </div>
                <div className="prediction-item">
                  <span className="prediction-icon">💵</span>
                  <p>Expected price drop percentages</p>
                </div>
                <div className="prediction-item">
                  <span className="prediction-icon">🔄</span>
                  <p>Alternative drug recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="section white-bg">
          <div className="container">
            <h2 className="section-title">Data Sources</h2>
            
            <div className="data-sources">
              <div className="source-card">
                <h4>🏛️ FDA Orange Book</h4>
                <p>Official database of approved drug products with patent and exclusivity information</p>
              </div>
              <div className="source-card">
                <h4>💊 Drug Composition Database</h4>
                <p>Active ingredients, dosage forms, and strength information for all medications</p>
              </div>
              <div className="source-card">
                <h4>💰 Pricing Data</h4>
                <p>Historical and current pricing information for brand-name and generic drugs</p>
              </div>
              <div className="source-card">
                <h4>🏥 Disease Classification</h4>
                <p>Mapping of diseases to medications and therapeutic categories</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section team-section">
          <div className="container">
            <h2 className="section-title">Our Team</h2>
            <p className="lead-text">
              A multidisciplinary team combining expertise in full-stack development, 
              data science, and DevOps engineering.
            </p>
            
            <div className="team-grid">
              <div className="team-member">
                <div className="member-role">Full Stack Developer & DevOps</div>
                <h3>Gauri</h3>
                <p>Backend development, API design, DevOps pipeline, and infrastructure management</p>
              </div>
              
              <div className="team-member">
                <div className="member-role">Full Stack Developer & UI/UX</div>
                <h3>Drishti</h3>
                <p>Frontend development, user interface design, and user experience optimization</p>
              </div>
              
              <div className="team-member">
                <div className="member-role">Data Scientist & ML Engineer</div>
                <h3>Dishita</h3>
                <p>Data collection, ML model development, predictions, and analytics</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="section white-bg">
          <div className="container">
            <h2 className="section-title">Expected Impact</h2>
            
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">👥</div>
                <h4>For Patients</h4>
                <ul>
                  <li>Save $1,200 - $5,000 annually on medications</li>
                  <li>Make informed decisions about drug alternatives</li>
                  <li>Reduce medication non-adherence due to cost</li>
                  <li>Access to transparent pricing information</li>
                </ul>
              </div>
              
              <div className="impact-card">
                <div className="impact-icon">🏥</div>
                <h4>For Healthcare System</h4>
                <ul>
                  <li>Promote generic drug adoption</li>
                  <li>Reduce overall healthcare expenditure</li>
                  <li>Increase medication adherence rates</li>
                  <li>Support value-based care initiatives</li>
                </ul>
              </div>
              
              <div className="impact-card">
                <div className="impact-icon">🎓</div>
                <h4>Educational Value</h4>
                <ul>
                  <li>Demonstrate real-world ML applications</li>
                  <li>Showcase full-stack development skills</li>
                  <li>Integrate DevOps best practices</li>
                  <li>Address genuine healthcare challenges</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section cta-section">
          <div className="container">
            <h2>Ready to Start Saving?</h2>
            <p>Discover how much you could save on your medications today</p>
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/disease-search'} className="cta-btn primary">
                Search by Disease
              </button>
              <button onClick={() => window.location.href = '/drug-search'} className="cta-btn secondary">
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
