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

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="about-hero">
          {/* Animated background orbs */}
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" s/>

          <div className="hero-container">
            <div className="hero-badge">
              <span className="badge-dot" />
              Capstone Project 2026
            </div>

            <h1 className="hero-title">
              Drug Alternative
              <span className="hero-title-accent"> Finder</span>
            </h1>

            <p className="hero-tagline">
              AI-Powered Platform to Save Money on Medications
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">90%</span>
                <span className="stat-label">Avg Savings</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">1,254</span>
                <span className="stat-label">Drugs Tracked</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
          </div>

          <div className="hero-scroll-hint">
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
            <span>Scroll to explore</span>
          </div>
        </section>

        {/* ── What We Do ───────────────────────────────────────────────── */}
        <section className="mission-section">
          <div className="content-container">
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-heading">
              Making Drug Costs <em>Transparent</em>
            </h2>
            <p className="mission-text">
              We help patients discover <strong>cheaper generic alternatives</strong> for expensive
              brand-name medications using AI to track patent expirations and predict when
              generics will become available.
            </p>

            <div className="features">
              {[
                { emoji: '🔍', title: 'Search by Disease',  desc: 'Find medications for your condition' },
                { emoji: '💊', title: 'Find Alternatives',   desc: 'Discover cheaper generic options'   },
                { emoji: '🤖', title: 'AI Predictions',      desc: 'Know when generics will launch'      },
                { emoji: '💰', title: 'Save Money',          desc: 'Cut costs by 20–90%'                 },
              ].map((f, i) => (
                <div className="feature" key={f.title} style={{ '--i': i }}>
                  <div className="feature-icon-wrap">
                    <span className="feature-emoji">{f.emoji}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────── */}
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
                    <em> when</em> it will become available.
                  </p>
                  <p>
                    From a technical standpoint, this capstone project demonstrates the full spectrum of modern software
                    development. The <strong>frontend</strong> is built with React.js, providing a responsive and intuitive
                    user interface. The <strong>backend</strong> uses Node.js and Express to serve RESTful APIs with JWT
                    authentication. The <strong>data science pipeline</strong> employs Python, Pandas, and Scikit-learn for
                    data processing and model training. Finally, our <strong>DevOps infrastructure</strong> utilises Docker
                    for containerisation and Apache Airflow for automated data pipeline orchestration.
                  </p>
                  <p>
                    The impact potential is significant. With generic drugs offering 20–90% cost savings compared to
                    brand-name equivalents, and over 110 major drugs losing patent protection in 2026–2027, our platform
                    could help millions of patients save thousands of dollars annually.
                  </p>
                </div>

                <div className="explanation-highlights">
                  {[
                    { icon: '📊', title: 'Data-Driven',   desc: 'Built on FDA Orange Book data with 500+ historical drug launches for ML training' },
                    { icon: '🎯', title: 'Predictive AI', desc: '78% accuracy in forecasting when generic drugs will launch in the market' },
                    { icon: '⚡', title: 'Real-Time',     desc: 'Automated pipelines keep patent and pricing data current every 24 hours' },
                    { icon: '🔒', title: 'Secure',        desc: 'JWT authentication and encrypted user data for privacy protection' },
                  ].map((h, i) => (
                    <div className="highlight-card" key={h.title} style={{ '--i': i }}>
                      <div className="highlight-icon">{h.icon}</div>
                      <h4>{h.title}</h4>
                      <p>{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Savings Impact ───────────────────────────────────────────── */}
        <section className="savings-section">
          <div className="content-container">
            <div className="section-eyebrow light">Why It Matters</div>
            <h2 className="section-heading light">The Power of Generic Drugs</h2>

            <div className="savings-cards">
              {[
                { icon: '💵', value: '20–90%', label: 'Cost Savings',         delay: '0s'    },
                { icon: '💊', value: '51%',    label: 'Avg Generic Reduction', delay: '0.1s'  },
                { icon: '🧬', value: '60%',    label: 'Biosimilar Reduction',  delay: '0.2s'  },
              ].map(c => (
                <div className="savings-card" key={c.label} style={{ animationDelay: c.delay }}>
                  <div className="card-icon">{c.icon}</div>
                  <div className="card-value">{c.value}</div>
                  <div className="card-label">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="savings-note">
              💡 Generic prices drop even further as more manufacturers enter the market
            </div>
          </div>
        </section>

        {/* ── Tech Stack ───────────────────────────────────────────────── */}
        <section className="tech-section">
          <div className="content-container">
            <div className="section-eyebrow">Under the Hood</div>
            <h2 className="section-heading">Built With Modern Technology</h2>

            <div className="tech-grid">
              {[
                { emoji: '⚛️', title: 'Frontend',  desc: 'React.js, Responsive Design'         },
                { emoji: '🔧', title: 'Backend',   desc: 'Node.js, Express, JWT Auth'           },
                { emoji: '🤖', title: 'AI / ML',   desc: 'Python, Scikit-learn, Random Forest'  },
                { emoji: '🚀', title: 'DevOps',    desc: 'Docker, Airflow, CI/CD'               },
              ].map((t, i) => (
                <div className="tech-card" key={t.title} style={{ '--i': i }}>
                  <div className="tech-emoji">{t.emoji}</div>
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                  <div className="tech-card-glow" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section className="team-section">
          <div className="content-container">
            <div className="section-eyebrow">The Builders</div>
            <h2 className="section-heading">Meet Our Team</h2>

            <div className="team-cards">
              {[
                { initial: 'G', name: 'Gauri',   role: 'Full Stack & DevOps',  desc: 'Backend, APIs, Infrastructure'         },
                { initial: 'D', name: 'Drishti', role: 'Full Stack & UI/UX',   desc: 'Frontend, Design, User Experience'     },
                { initial: 'D', name: 'Dishita', role: 'Data Science & ML',    desc: 'AI Models, Predictions, Analytics'     },
              ].map((m, i) => (
                <div className="team-card" key={m.name} style={{ '--i': i }}>
                  <div className="member-avatar-wrap">
                    <div className="member-avatar">{m.initial}</div>
                    <div className="avatar-ring" />
                  </div>
                  <h3>{m.name}</h3>
                  <p className="member-role">{m.role}</p>
                  <p className="member-desc">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="cta-section">
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
          <div className="content-container cta-inner">
            <h2>Ready to Start Saving?</h2>
            <p>Discover how much you could save on your medications today</p>
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
