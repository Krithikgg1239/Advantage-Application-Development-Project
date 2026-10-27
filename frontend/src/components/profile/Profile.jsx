import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const THEME_ACCENTS = [
  { id: "cyan", name: "Cyan Neon", color: "#00f2fe", dark: "#00b8c4", gradient: "linear-gradient(135deg, #00f2fe 0%, #00d2ff 100%)" },
  { id: "emerald", name: "Emerald Matrix", color: "#10b981", dark: "#059669", gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
  { id: "indigo", name: "Royal Indigo", color: "#6366f1", dark: "#4f46e5", gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" },
  { id: "sunset", name: "Sunset Magenta", color: "#ec4899", dark: "#db2777", gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" },
];

const ROLE_DETAILS = {
  ADMANAGER: {
    title: "Ad Operations Manager",
    badgeClass: "cyan",
    desc: "Full administrative access to create, edit, pause, and audit all marketing campaigns and traffic streams.",
    permissions: [
      { name: "Global Campaign Management", granted: true, desc: "Create, update, pause, or remove any campaign." },
      { name: "Real-time Traffic Simulator", granted: true, desc: "Generate simulated impressions and audience view waves." },
      { name: "Full Financial & ROI Audits", granted: true, desc: "Access comprehensive budget metrics and CSV/JSON exports." },
      { name: "User & Role Oversight", granted: true, desc: "Inspect and manage permissions across client accounts." },
    ],
  },
  CLIENT: {
    title: "Brand Client / Sponsor",
    badgeClass: "indigo",
    desc: "Campaign sponsor view with self-service campaign creation, ROI forecasting, and performance analytics.",
    permissions: [
      { name: "Self-Service Campaign Creation", granted: true, desc: "Launch new marketing campaigns and set target ROIs." },
      { name: "Analytical Performance Reports", granted: true, desc: "Download and export spend and conversion reports." },
      { name: "Audience Reach Metrics", granted: true, desc: "Monitor views, sales, and conversion percentages." },
      { name: "Global System Administration", granted: false, desc: "Requires ADMANAGER role privileges." },
    ],
  },
  AUDIENCE: {
    title: "Audience Member / Consumer",
    badgeClass: "emerald",
    desc: "Interactive consumer experience to explore campaigns, claim offers, participate in polls, and customize preferences.",
    permissions: [
      { name: "Live Campaign Discovery", granted: true, desc: "Browse, filter, and search active brand campaigns." },
      { name: "Interactive ROI & Offer Calculator", granted: true, desc: "Test offer projections and claim discount vouchers." },
      { name: "Live Sentiment & Community Polls", granted: true, desc: "Vote on trending brand concepts and view real-time tallies." },
      { name: "Personal Interest Matching", granted: true, desc: "Customize tags to calculate dynamic match scores." },
    ],
  },
};

const INITIAL_ACTIVITIES = [
  { id: 1, action: "Session Initialized", time: "Just now", icon: "🔑", detail: "Authenticated via JWT Security Token" },
  { id: 2, action: "Dashboard Accessed", time: "2 mins ago", icon: "📊", detail: "Inspected campaign performance analytics" },
  { id: 3, action: "Theme Applied", time: "5 mins ago", icon: "🎨", detail: "Synchronized dark glassmorphism layout" },
  { id: 4, action: "Profile Inspected", time: "10 mins ago", icon: "👤", detail: "Verified role permission boundaries" },
];

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAccent, setSelectedAccent] = useState(
    localStorage.getItem("ah_theme_accent") || "cyan"
  );
  const [compactMode, setCompactMode] = useState(
    localStorage.getItem("ah_compact_mode") === "true"
  );
  const [bio, setBio] = useState(
    localStorage.getItem(`ah_bio_${user?.username}`) ||
      "Marketing enthusiast and digital growth strategist on the AdVantage platform."
  );
  const [displayName, setDisplayName] = useState(
    localStorage.getItem(`ah_name_${user?.username}`) || user?.username || "User"
  );

  const roleInfo = ROLE_DETAILS[user?.role] || ROLE_DETAILS.AUDIENCE;

  // Apply accent color live
  useEffect(() => {
    const accentObj = THEME_ACCENTS.find((a) => a.id === selectedAccent) || THEME_ACCENTS[0];
    document.documentElement.style.setProperty("--ah-accent", accentObj.color);
    document.documentElement.style.setProperty("--ah-accent-dark", accentObj.dark);
    document.documentElement.style.setProperty("--ah-accent-gradient", accentObj.gradient);
    localStorage.setItem("ah_theme_accent", selectedAccent);
  }, [selectedAccent]);

  const handleSaveBio = (e) => {
    e.preventDefault();
    localStorage.setItem(`ah_bio_${user?.username}`, bio);
    localStorage.setItem(`ah_name_${user?.username}`, displayName);
    toast.success("Profile information updated successfully!");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="ah-page ah-profile-page">
      {/* Profile Hero Header */}
      <section className="ah-profile-hero">
        <div className="ah-profile-hero__backdrop" />

        <div className="ah-profile-hero__content">
          <div className="ah-profile-avatar-wrapper">
            <div className="ah-profile-avatar">
              <span>{(displayName || user?.username || "U").charAt(0).toUpperCase()}</span>
            </div>
            <span className="ah-profile-status-badge" title="Online" />
          </div>

          <div className="ah-profile-info">
            <div className="ah-profile-title-row">
              <h2>{displayName}</h2>
              <span className={`ah-pill ah-pill--${roleInfo.badgeClass}`}>
                {user?.role}
              </span>
            </div>

            <p className="ah-profile-tagline">
              @{user?.username} &bull; {roleInfo.title}
            </p>

            <div className="ah-profile-meta-chips">
              <span className="ah-meta-chip">
                <i className="ah-chip-icon">📅</i> Joined Sept 2026
              </span>
              <span className="ah-meta-chip">
                <i className="ah-chip-icon">🛡️</i> Verified Access
              </span>
              <span className="ah-meta-chip">
                <i className="ah-chip-icon">⚡</i> Active Token
              </span>
            </div>
          </div>

          <div className="ah-profile-actions">
            <button
              type="button"
              className="ah-btn ah-btn--ghost"
              onClick={() => navigate("/")}
            >
              ← Back to Dashboard
            </button>
            <button
              type="button"
              className="ah-btn ah-btn--danger-ghost"
              onClick={handleLogout}
            >
              Sign Out ⎋
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="ah-profile-nav-tabs">
          <button
            type="button"
            className={`ah-profile-tab ${activeTab === "overview" ? "ah-profile-tab--active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            👤 Overview &amp; Bio
          </button>
          <button
            type="button"
            className={`ah-profile-tab ${activeTab === "permissions" ? "ah-profile-tab--active" : ""}`}
            onClick={() => setActiveTab("permissions")}
          >
            🛡️ Role &amp; Permissions
          </button>
          <button
            type="button"
            className={`ah-profile-tab ${activeTab === "theme" ? "ah-profile-tab--active" : ""}`}
            onClick={() => setActiveTab("theme")}
          >
            🎨 Theme &amp; UI Styling
          </button>
          <button
            type="button"
            className={`ah-profile-tab ${activeTab === "activity" ? "ah-profile-tab--active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            📋 Activity Log
          </button>
        </div>
      </section>

      {/* Tab Contents */}
      <section className="ah-profile-tab-body">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="ah-profile-grid ah-profile-grid--clean">
            <div className="ah-dashboard-panel">
              <div className="ah-panel-heading">
                <div>
                  <span className="ah-panel-kicker">PERSONAL DETAILS</span>
                  <h3>Account Information</h3>
                </div>
              </div>

              <form onSubmit={handleSaveBio} className="ah-profile-form">
                <div className="ah-form-row">
                  <label className="ah-field">
                    <span>Display Name</span>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="ah-field">
                    <span>Username (Login Handle)</span>
                    <input
                      type="text"
                      value={user?.username || ""}
                      disabled
                      className="ah-input--disabled"
                    />
                  </label>
                </div>

                <div className="ah-form-row">
                  <label className="ah-field">
                    <span>Email Address</span>
                    <input
                      type="email"
                      value={`${user?.username}@advantage.com`}
                      disabled
                      className="ah-input--disabled"
                    />
                  </label>

                  <label className="ah-field">
                    <span>System Role</span>
                    <input
                      type="text"
                      value={user?.role || ""}
                      disabled
                      className="ah-input--disabled"
                    />
                  </label>
                </div>

                <label className="ah-field">
                  <span>About / Bio</span>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your marketing focus..."
                  />
                </label>

                <button type="submit" className="ah-btn ah-btn--primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Permissions */}
        {activeTab === "permissions" && (
          <div className="ah-dashboard-panel">
            <div className="ah-panel-heading">
              <div>
                <span className="ah-panel-kicker">RBAC AUTHORIZATION</span>
                <h3>Permissions Matrix for {user?.role}</h3>
                <p className="ah-muted">{roleInfo.desc}</p>
              </div>
            </div>

            <div className="ah-permissions-grid">
              {roleInfo.permissions.map((p, idx) => (
                <div
                  key={idx}
                  className={`ah-perm-card ${p.granted ? "ah-perm-card--granted" : "ah-perm-card--denied"}`}
                >
                  <div className="ah-perm-card__top">
                    <span className="ah-perm-icon">{p.granted ? "✓" : "✕"}</span>
                    <strong>{p.name}</strong>
                    <span className={`ah-perm-pill ${p.granted ? "granted" : "denied"}`}>
                      {p.granted ? "Authorized" : "Restricted"}
                    </span>
                  </div>
                  <p className="ah-muted">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Theme */}
        {activeTab === "theme" && (
          <div className="ah-dashboard-panel">
            <div className="ah-panel-heading">
              <div>
                <span className="ah-panel-kicker">VISUAL THEME &amp; AESTHETICS</span>
                <h3>Customize Your Platform Theme</h3>
                <p className="ah-muted">Pick your preferred glow accent color and layout modes.</p>
              </div>
            </div>

            <div className="ah-theme-picker-section">
              <label className="ah-theme-label">Glow Accent Palette</label>
              <div className="ah-accent-cards-grid">
                {THEME_ACCENTS.map((accent) => (
                  <div
                    key={accent.id}
                    className={`ah-accent-card ${selectedAccent === accent.id ? "ah-accent-card--selected" : ""}`}
                    onClick={() => {
                      setSelectedAccent(accent.id);
                      toast.success(`Theme accent set to ${accent.name}`);
                    }}
                  >
                    <div
                      className="ah-accent-preview-dot"
                      style={{ background: accent.gradient, boxShadow: `0 0 15px ${accent.color}` }}
                    />
                    <div className="ah-accent-card__name">{accent.name}</div>
                    {selectedAccent === accent.id && <span className="ah-accent-check">✓ Active</span>}
                  </div>
                ))}
              </div>

              <div className="ah-theme-toggle-row">
                <div>
                  <strong>Compact Workspace Mode</strong>
                  <p className="ah-muted">Reduces card paddings for high-density analytics viewing.</p>
                </div>
                <button
                  type="button"
                  className={`ah-switch-btn ${compactMode ? "ah-switch-btn--on" : ""}`}
                  onClick={() => {
                    const next = !compactMode;
                    setCompactMode(next);
                    localStorage.setItem("ah_compact_mode", String(next));
                    toast.success(next ? "Compact mode enabled" : "Compact mode disabled");
                  }}
                >
                  <span className="ah-switch-thumb" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Activity Log */}
        {activeTab === "activity" && (
          <div className="ah-dashboard-panel">
            <div className="ah-panel-heading">
              <div>
                <span className="ah-panel-kicker">AUDIT TRAIL</span>
                <h3>Recent Account Activities</h3>
                <p className="ah-muted">Timestamped log of sessions and account interactions.</p>
              </div>
            </div>

            <div className="ah-activity-timeline">
              {INITIAL_ACTIVITIES.map((act) => (
                <div key={act.id} className="ah-timeline-item">
                  <div className="ah-timeline-icon">{act.icon}</div>
                  <div className="ah-timeline-content">
                    <div className="ah-timeline-header">
                      <strong>{act.action}</strong>
                      <span className="ah-timeline-time">{act.time}</span>
                    </div>
                    <p className="ah-muted">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
