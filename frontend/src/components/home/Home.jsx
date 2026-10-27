import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FEATURED_CAMPAIGNS = [
  {
    id: "camp-1",
    title: "Summer Sale 2024 Tech Blast",
    category: "E-Commerce & Retail",
    badge: "🔥 Trending",
    tagline: "High-converting seasonal retail push with targeted discount vouchers across digital storefronts.",
    budget: 25000,
    targetRoi: "4.2x",
    reach: "45,200",
    conversions: "1,890",
    timeline: "June 01 – August 31",
    accent: "cyan",
    icon: "🛍️",
  },
  {
    id: "camp-2",
    title: "Cloud Automation Growth Suite",
    category: "SaaS & Cloud Tech",
    badge: "⚡ High ROI",
    tagline: "Multi-channel B2B customer acquisition drive targeting high-growth technology leaders and developers.",
    budget: 40000,
    targetRoi: "5.0x",
    reach: "82,400",
    conversions: "3,410",
    timeline: "July 15 – October 30",
    accent: "indigo",
    icon: "🚀",
  },
  {
    id: "camp-3",
    title: "Next-Gen VR & Gaming Launch",
    category: "Gaming & Apps",
    badge: "🎮 Exclusive Drop",
    tagline: "Interactive community drop featuring early beta access vouchers, hardware perks, and live streams.",
    budget: 18000,
    targetRoi: "3.8x",
    reach: "38,900",
    conversions: "2,150",
    timeline: "August 01 – September 25",
    accent: "magenta",
    icon: "🎮",
  },
  {
    id: "camp-4",
    title: "FinTech Smart Pay Global Expansion",
    category: "FinTech & Banking",
    badge: "⭐ Top Verified",
    tagline: "Cross-border financial solutions drive offering zero-fee transaction credits and loyalty rewards.",
    budget: 35000,
    targetRoi: "4.6x",
    reach: "64,100",
    conversions: "2,980",
    timeline: "May 10 – November 15",
    accent: "emerald",
    icon: "💳",
  },
];

const FAQS = [
  {
    q: "How does the AdVantage audience conversion engine work?",
    a: "AdVantage matches live marketing campaigns to targeted audience personas in real-time, tracking view-throughs, click rates, and verified purchase conversions.",
  },
  {
    q: "How are campaign ROIs tracked?",
    a: "Our system calculates real-time performance based on campaign budget, verified impressions, clicks, and conversions.",
  },
  {
    q: "What access controls are supported?",
    a: "Strict role-based access control (RBAC) ensures operators, brand clients, and audiences access authorized workspaces.",
  },
];

function Home() {
  const user = useSelector((state) => state.auth.user);

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // FAQ open index
  const [openFaq, setOpenFaq] = useState(0);

  // Auto-play Slideshow rotation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_CAMPAIGNS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_CAMPAIGNS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + FEATURED_CAMPAIGNS.length) % FEATURED_CAMPAIGNS.length);
  };

  const activeCamp = FEATURED_CAMPAIGNS[currentSlide];

  return (
    <div className="ah-page ah-home-page">
      {/* Hero Section */}
      <section className="ah-home-hero">
        <div className="ah-home-hero__badge">
          <span className="ah-home-hero__badge-dot" />
          <span>Marketing Analytics &amp; Campaign Workspace</span>
        </div>

        <h1 className="ah-home-hero__title">
          Scale Campaigns with <span className="ah-gradient-text">Intelligent Real-Time</span> Analytics
        </h1>

        <p className="ah-home-hero__subtitle">
          AdVantage delivers real-time conversion tracking, predictive ROI models, and live audience management for modern marketing teams.
        </p>

        <div className="ah-home-hero__cta-group">
          {user ? (
            <Link to="/" className="ah-btn ah-btn--primary ah-btn--lg ah-btn--glow">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="ah-btn ah-btn--primary ah-btn--lg ah-btn--glow">
                Sign In to Account
              </Link>
              <Link to="/register" className="ah-btn ah-btn--secondary ah-btn--lg">
                Create Account
              </Link>
            </>
          )}
          <a href="#campaigns-showcase" className="ah-btn ah-btn--ghost ah-btn--lg">
            Explore Featured Campaigns ↓
          </a>
        </div>
      </section>

      {/* Featured Marketing Campaigns Slideshow */}
      <section
        id="campaigns-showcase"
        className="ah-home-section ah-showcase-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="ah-section-header text-center">
          <span className="ah-panel-kicker">SPOTLIGHT SHOWCASE</span>
          <h2>Live Marketing Campaigns</h2>
          <p className="ah-muted">
            Explore live brand initiatives and active promotional drives running across the AdVantage network.
          </p>
        </div>

        <div className="ah-campaign-slideshow">
          {/* Main Slide Card */}
          <div className={`ah-slide-card ah-slide-card--${activeCamp.accent}`}>
            <div className="ah-slide-card__header">
              <div className="ah-slide-badge-group">
                <span className="ah-slide-badge">{activeCamp.badge}</span>
                <span className="ah-slide-category">
                  {activeCamp.icon} {activeCamp.category}
                </span>
              </div>
              <span className="ah-slide-counter">
                {currentSlide + 1} of {FEATURED_CAMPAIGNS.length}
              </span>
            </div>

            <div className="ah-slide-card__body">
              <h3 className="ah-slide-title">{activeCamp.title}</h3>
              <p className="ah-slide-tagline">{activeCamp.tagline}</p>

              <div className="ah-slide-metrics-grid">
                <div className="ah-slide-metric">
                  <span className="ah-muted">Campaign Budget</span>
                  <strong>${activeCamp.budget.toLocaleString()}</strong>
                </div>
                <div className="ah-slide-metric">
                  <span className="ah-muted">Target Return</span>
                  <strong className="ah-highlight-roi">{activeCamp.targetRoi}</strong>
                </div>
                <div className="ah-slide-metric">
                  <span className="ah-muted">Verified Reach</span>
                  <strong>{activeCamp.reach}</strong>
                </div>
                <div className="ah-slide-metric">
                  <span className="ah-muted">Conversions</span>
                  <strong className="text-success">{activeCamp.conversions}</strong>
                </div>
              </div>

              <div className="ah-slide-footer">
                <span className="ah-slide-timeline">📅 Active: {activeCamp.timeline}</span>
                <Link to={user ? "/" : "/login"} className="ah-btn ah-btn--primary ah-btn--sm">
                  {user ? "View in Dashboard →" : "Sign In to View Details →"}
                </Link>
              </div>
            </div>
          </div>

          {/* Slideshow Controls Bar */}
          <div className="ah-slideshow-controls">
            <button
              type="button"
              className="ah-slide-arrow-btn"
              onClick={prevSlide}
              aria-label="Previous campaign slide"
            >
              ←
            </button>

            <div className="ah-slide-dots">
              {FEATURED_CAMPAIGNS.map((camp, idx) => (
                <button
                  key={camp.id}
                  type="button"
                  className={`ah-slide-dot ${currentSlide === idx ? "ah-slide-dot--active" : ""}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${camp.title}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="ah-slide-arrow-btn"
              onClick={nextSlide}
              aria-label="Next campaign slide"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works: Campaign Lifecycle */}
      <section className="ah-home-section ah-lifecycle-section">
        <div className="ah-section-header text-center">
          <span className="ah-panel-kicker">HOW ADVANTAGE WORKS</span>
          <h2>A Smarter Workflow for Digital Marketing</h2>
          <p className="ah-muted">
            From initial budget allocation to live conversion tracking in three straightforward steps.
          </p>
        </div>

        <div className="ah-lifecycle-grid">
          <div className="ah-lifecycle-step">
            <div className="ah-step-number">01</div>
            <div className="ah-step-icon">🚀</div>
            <h3>Define &amp; Launch</h3>
            <p>
              Set campaign timelines, allocate budgets, and define target ROI thresholds through a guided management interface.
            </p>
          </div>

          <div className="ah-lifecycle-step">
            <div className="ah-step-number">02</div>
            <div className="ah-step-icon">🎯</div>
            <h3>Engage Audiences</h3>
            <p>
              Match campaigns dynamically across targeted consumer interest categories with interactive offers and community polls.
            </p>
          </div>

          <div className="ah-lifecycle-step">
            <div className="ah-step-number">03</div>
            <div className="ah-step-icon">📈</div>
            <h3>Track &amp; Scale</h3>
            <p>
              Monitor real-time impression streams, conversion funnels, and verified checkout telemetry across unified analytics dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="ah-home-section ah-features-grid-section">
        <div className="ah-section-header text-center">
          <span className="ah-panel-kicker">CORE CAPABILITIES</span>
          <h2>Platform Features</h2>
          <p className="ah-muted">Built for fast performance and clean usability.</p>
        </div>

        <div className="ah-feature-cards-grid">
          <div className="ah-feat-card">
            <div className="ah-feat-icon">🎯</div>
            <h3>Targeted Audiences</h3>
            <p>Segment campaigns across dynamic categories, target ROIs, and budget thresholds.</p>
          </div>

          <div className="ah-feat-card">
            <div className="ah-feat-icon">⚡</div>
            <h3>Real-Time Metrics</h3>
            <p>Track impressions, clicks, and purchase events across dashboards.</p>
          </div>

          <div className="ah-feat-card">
            <div className="ah-feat-icon">📊</div>
            <h3>Visual Analytics</h3>
            <p>Performance charts and conversion metrics for active campaigns.</p>
          </div>

          <div className="ah-feat-card">
            <div className="ah-feat-icon">🛡️</div>
            <h3>Role-Based Access</h3>
            <p>Strict permission boundaries between Ad Managers, Clients, and Audience users.</p>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="ah-home-section ah-faq-section">
        <div className="ah-section-header text-center">
          <span className="ah-panel-kicker">HELP &amp; FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="ah-faq-list">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`ah-faq-item ${openFaq === idx ? "ah-faq-item--open" : ""}`}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div className="ah-faq-question">
                <span>{faq.q}</span>
                <span className="ah-faq-icon">{openFaq === idx ? "−" : "+"}</span>
              </div>
              {openFaq === idx && (
                <div className="ah-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
