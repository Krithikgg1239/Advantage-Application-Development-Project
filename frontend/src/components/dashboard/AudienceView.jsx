import React, { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { clickCampaign, buyCampaign } from "../../store/slices/campaignSlice";
import EmptyState from "../common/EmptyState";

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: "🌐" },
  { id: "tech", label: "Technology", icon: "🚀", keywords: ["tech", "cloud", "saas", "software", "data", "code"] },
  { id: "ecom", label: "E-Commerce", icon: "🛍️", keywords: ["shop", "store", "sale", "retail", "summer", "discount"] },
  { id: "gaming", label: "Gaming & VR", icon: "🎮", keywords: ["game", "vr", "quest", "steam", "play", "gear"] },
  { id: "fintech", label: "FinTech", icon: "💳", keywords: ["crypto", "finance", "bank", "pay", "invest", "money"] },
  { id: "health", label: "Health & Fitness", icon: "🌿", keywords: ["fit", "health", "gym", "wellness", "diet", "care"] },
];

const INITIAL_POLL = {
  question: "Which promotional perks do you value the most this season?",
  totalVotes: 1420,
  options: [
    { id: 1, text: "Instant 25% Off Checkout Voucher", votes: 680 },
    { id: 2, text: "Free VIP Lifetime Software Tier", votes: 450 },
    { id: 3, text: "Exclusive Early Access Beta Drops", votes: 290 },
  ],
};

function AudienceView({ items = [], dispatch }) {
  // Tabs
  const [activeTab, setActiveTab] = useState("explore"); // 'explore' | 'matched' | 'bookmarked' | 'purchased'

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("roi_desc");
  const maxBudgetFilter = 50000;

  // User Interest Tags for Match scoring
  const [userInterests, setUserInterests] = useState(["tech", "gaming", "ecom"]);

  // Interactive State
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ah_bookmarked_ids") || "[]");
    } catch {
      return [];
    }
  });

  const [purchasedHistory, setPurchasedHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ah_purchased_history") || "[]");
    } catch {
      return [];
    }
  });

  const [activeCampaign, setActiveCampaign] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [pollData, setPollData] = useState(INITIAL_POLL);
  const [votedOptionId, setVotedOptionId] = useState(null);

  // Toggle interest tags
  const toggleInterest = (catId) => {
    setUserInterests((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    toast.success("Updated your interest preferences!");
  };

  // Toggle bookmark
  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("ah_bookmarked_ids", JSON.stringify(next));
      toast.success(next.includes(id) ? "Saved to Bookmarks!" : "Removed from Bookmarks");
      return next;
    });
  };

  // Open detail modal and record click
  const openCampaign = (campaign) => {
    if (dispatch && campaign?.id) {
      dispatch(clickCampaign(campaign.id));
    }
    setActiveCampaign(campaign);
    setClaimQuantity(1);
  };

  // Handle buy / claim offer
  const handleBuy = (campaign) => {
    if (dispatch && campaign?.id) {
      dispatch(buyCampaign(campaign.id));
    }
    const receipt = {
      id: "REC-" + Math.floor(100000 + Math.random() * 900000),
      campaignId: campaign.id,
      campaignName: campaign.name,
      budget: campaign.budget,
      quantity: claimQuantity,
      claimedAt: new Date().toLocaleString(),
    };
    const nextHistory = [receipt, ...purchasedHistory];
    setPurchasedHistory(nextHistory);
    localStorage.setItem("ah_purchased_history", JSON.stringify(nextHistory));
    toast.success(`🎉 Successfully claimed ${claimQuantity}x deal for "${campaign.name}"!`);
    setActiveCampaign(null);
  };

  // Handle poll vote
  const handleVote = (optionId) => {
    if (votedOptionId) {
      toast.error("You have already voted in this community poll!");
      return;
    }
    setVotedOptionId(optionId);
    setPollData((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));
    toast.success("Thank you for your vote!");
  };

  // Calculate Match Score for a campaign
  const calculateMatchScore = useCallback((campaign) => {
    const text = (campaign.name + " " + (campaign.targetRoi || "")).toLowerCase();
    let score = 75;
    userInterests.forEach((interest) => {
      const cat = CATEGORIES.find((c) => c.id === interest);
      if (cat?.keywords?.some((k) => text.includes(k))) {
        score += 8;
      }
    });
    return Math.min(score, 99);
  }, [userInterests]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let list = [...items];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => (c.name || "").toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      if (cat?.keywords) {
        list = list.filter((c) => {
          const name = (c.name || "").toLowerCase();
          return cat.keywords.some((kw) => name.includes(kw));
        });
      }
    }

    // Budget range filter
    list = list.filter((c) => Number(c.budget || 0) <= maxBudgetFilter || maxBudgetFilter >= 50000);

    // Tab filter
    if (activeTab === "bookmarked") {
      list = list.filter((c) => bookmarkedIds.includes(c.id));
    } else if (activeTab === "matched") {
      list = list.filter((c) => calculateMatchScore(c) >= 85);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "roi_desc") {
        return (Number(b.targetRoi) || 0) - (Number(a.targetRoi) || 0);
      }
      if (sortBy === "views_desc") {
        return (b.clickCount || 0) - (a.clickCount || 0);
      }
      if (sortBy === "budget_asc") {
        return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      }
      if (sortBy === "budget_desc") {
        return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      }
      return 0;
    });

    return list;
  }, [items, searchQuery, selectedCategory, maxBudgetFilter, activeTab, bookmarkedIds, sortBy, calculateMatchScore]);

  return (
    <div className="ah-page ah-audience-portal">
      {/* Header Banner */}
      <header className="ah-audience-hero">
        <div className="ah-audience-hero__left">
          <div className="ah-dashboard-eyebrow">INTERACTIVE AUDIENCE PORTAL</div>
          <h1>Discover &amp; Engage with Live Brand Campaigns</h1>
          <p className="ah-muted">
            Explore active marketing experiences, personalize interest tags for tailored deals, and participate in community polls.
          </p>
        </div>

        <div className="ah-audience-hero__stats">
          <div className="ah-aud-stat-box">
            <span>Active Offers</span>
            <strong>{items.length}</strong>
          </div>
          <div className="ah-aud-stat-box">
            <span>Saved Deals</span>
            <strong>{bookmarkedIds.length}</strong>
          </div>
          <div className="ah-aud-stat-box">
            <span>Claimed Rewards</span>
            <strong>{purchasedHistory.length}</strong>
          </div>
        </div>
      </header>

      {/* Interest Matching Preference Tuner */}
      <section className="ah-interest-tuner-card">
        <div className="ah-interest-tuner__header">
          <div className="ah-interest-tuner__title">
            <span className="ah-pulse-icon">🎯</span>
            <div>
              <strong>Personalize Your Deal Matches</strong>
              <p className="ah-muted">Select your favorite topics to calculate tailored match scores for each campaign</p>
            </div>
          </div>
          <span className="ah-active-interests-count">
            {userInterests.length} Topics Selected
          </span>
        </div>

        <div className="ah-interest-pills-row">
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const isSelected = userInterests.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                className={`ah-interest-pill ${isSelected ? "ah-interest-pill--selected" : ""}`}
                onClick={() => toggleInterest(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="ah-pill-status-dot">{isSelected ? "✓" : "+"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="ah-audience-nav-tabs">
        <button
          type="button"
          className={`ah-aud-nav-btn ${activeTab === "explore" ? "ah-aud-nav-btn--active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          🌐 Browse All ({items.length})
        </button>
        <button
          type="button"
          className={`ah-aud-nav-btn ${activeTab === "matched" ? "ah-aud-nav-btn--active" : ""}`}
          onClick={() => setActiveTab("matched")}
        >
          🎯 Recommended Deals
        </button>
        <button
          type="button"
          className={`ah-aud-nav-btn ${activeTab === "bookmarked" ? "ah-aud-nav-btn--active" : ""}`}
          onClick={() => setActiveTab("bookmarked")}
        >
          ⭐ Saved Bookmarks ({bookmarkedIds.length})
        </button>
        <button
          type="button"
          className={`ah-aud-nav-btn ${activeTab === "purchased" ? "ah-aud-nav-btn--active" : ""}`}
          onClick={() => setActiveTab("purchased")}
        >
          🛍️ Claimed History ({purchasedHistory.length})
        </button>
      </div>

      {activeTab === "purchased" ? (
        /* Claimed History View */
        <section className="ah-dashboard-panel">
          <div className="ah-panel-heading">
            <div>
              <span className="ah-panel-kicker">YOUR REWARDS</span>
              <h2>Claimed Deals &amp; Vouchers</h2>
              <p className="ah-muted">Receipts of all campaigns and offers you have claimed.</p>
            </div>
          </div>

          {purchasedHistory.length === 0 ? (
            <EmptyState message="You haven't claimed any offers yet. Click 'View Campaign' on any card to claim your first reward!" />
          ) : (
            <div className="ah-receipts-grid">
              {purchasedHistory.map((rec) => (
                <div key={rec.id} className="ah-receipt-card">
                  <div className="ah-receipt-card__top">
                    <span className="ah-receipt-tag">Verified Claim</span>
                    <code className="ah-receipt-code">{rec.id}</code>
                  </div>
                  <h3>{rec.campaignName}</h3>
                  <div className="ah-receipt-details">
                    <div>
                      <span className="ah-muted">Claimed Quantity:</span>
                      <strong>{rec.quantity}x</strong>
                    </div>
                    <div>
                      <span className="ah-muted">Timestamp:</span>
                      <span>{rec.claimedAt}</span>
                    </div>
                  </div>
                  <div className="ah-receipt-status">
                    <span className="ah-dot-success">●</span> Voucher Active &amp; Ready for Use
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Explore / Matched / Bookmarked Campaign Grid */
        <div className="ah-audience-main-layout">
          {/* Main Campaign Cards Area */}
          <div className="ah-audience-content-area">
            {/* Filter Bar */}
            <div className="ah-audience-filter-bar">
              <div className="ah-search-box">
                <span className="ah-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search campaigns, brands, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="ah-search-clear"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="ah-filter-dropdowns">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="ah-select-filter"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ah-select-filter"
                >
                  <option value="roi_desc">⚡ Highest Target ROI</option>
                  <option value="views_desc">🔥 Most Popular Views</option>
                  <option value="budget_desc">💰 Largest Campaign Budget</option>
                  <option value="budget_asc">💵 Lowest Entry Budget</option>
                </select>
              </div>
            </div>

            {/* Campaign Cards Grid */}
            {filteredItems.length === 0 ? (
              <EmptyState message="No campaigns match your current filters. Try resetting search or category." />
            ) : (
              <div className="ah-card-grid ah-card-grid--audience">
                {filteredItems.map((c) => {
                  const matchScore = calculateMatchScore(c);
                  const isBookmarked = bookmarkedIds.includes(c.id);
                  const isPurchased = purchasedHistory.some((p) => p.campaignId === c.id);

                  return (
                    <div
                      key={c.id}
                      className="ah-audience-card"
                      onClick={() => openCampaign(c)}
                    >
                      <div className="ah-audience-card__top">
                        <div className="ah-match-badge" title="Calculated based on your selected interests">
                          <span className="ah-match-star">✨</span> {matchScore}% Match
                        </div>

                        <button
                          type="button"
                          className={`ah-bookmark-btn ${isBookmarked ? "ah-bookmark-btn--saved" : ""}`}
                          onClick={(e) => toggleBookmark(c.id, e)}
                          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        >
                          {isBookmarked ? "★ Saved" : "☆ Save"}
                        </button>
                      </div>

                      <h3 className="ah-audience-card__title">{c.name}</h3>

                      <p className="ah-muted ah-audience-card__dates">
                        📅 {c.startDate} &ndash; {c.endDate}
                      </p>

                      <div className="ah-audience-card__stats-row">
                        <div className="ah-aud-stat">
                          <span className="ah-muted">Target ROI</span>
                          <strong className="ah-highlight-roi">
                            {c.targetRoi || "3.5x"}
                          </strong>
                        </div>

                        <div className="ah-aud-stat">
                          <span className="ah-muted">Budget Pool</span>
                          <strong>${Number(c.budget || 0).toLocaleString()}</strong>
                        </div>

                        <div className="ah-aud-stat">
                          <span className="ah-muted">Audience Views</span>
                          <strong>{(c.clickCount || 0) + 120}</strong>
                        </div>
                      </div>

                      <div className="ah-audience-card__footer">
                        {isPurchased ? (
                          <span className="ah-status-pill-claimed">✓ Claimed</span>
                        ) : (
                          <span className="ah-cta-preview">Explore &amp; Claim Offer →</span>
                        )}
                        <span className="ah-card-status-pill">{c.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Sidebar: Live Sentiment Poll & Community Activity */}
          <aside className="ah-audience-sidebar">
            {/* Live Poll Widget */}
            <div className="ah-dashboard-panel ah-poll-widget">
              <div className="ah-panel-heading">
                <div>
                  <span className="ah-panel-kicker">COMMUNITY POLL</span>
                  <h3>Live Audience Vote</h3>
                </div>
                <span className="ah-live-dot" />
              </div>

              <p className="ah-poll-question">{pollData.question}</p>

              <div className="ah-poll-options">
                {pollData.options.map((opt) => {
                  const percentage = Math.round((opt.votes / pollData.totalVotes) * 100);
                  const isSelected = votedOptionId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`ah-poll-option-item ${isSelected ? "ah-poll-option--voted" : ""}`}
                      onClick={() => handleVote(opt.id)}
                    >
                      <div className="ah-poll-option-content">
                        <span>{opt.text}</span>
                        <strong>{percentage}%</strong>
                      </div>
                      <div className="ah-poll-progress-bg">
                        <div
                          className="ah-poll-progress-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ah-poll-footer">
                <span className="ah-muted">{pollData.totalVotes.toLocaleString()} votes cast</span>
                {votedOptionId && <span className="ah-vote-confirmed">✓ Vote Recorded</span>}
              </div>
            </div>

            {/* Live Trending Campaigns List */}
            <div className="ah-dashboard-panel ah-trending-widget">
              <div className="ah-panel-heading">
                <div>
                  <span className="ah-panel-kicker">TRENDING NOW</span>
                  <h3>Top Popular Offers</h3>
                </div>
              </div>

              <div className="ah-trending-items-list">
                {items.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    className="ah-trending-item"
                    onClick={() => openCampaign(c)}
                  >
                    <span className="ah-trending-rank">#{i + 1}</span>
                    <div className="ah-trending-info">
                      <strong>{c.name}</strong>
                      <span className="ah-muted">${Number(c.budget || 0).toLocaleString()} Pool</span>
                    </div>
                    <span className="ah-trending-arrow">↗</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Interactive Detail & Offer Modal */}
      {activeCampaign && (
        <div className="ah-modal-backdrop" onClick={() => setActiveCampaign(null)}>
          <div className="ah-modal ah-modal--interactive" onClick={(e) => e.stopPropagation()}>
            <div className="ah-modal__top-banner">
              <span className="ah-modal__eyebrow">EXCLUSIVE CAMPAIGN OFFER</span>
              <button
                type="button"
                className="ah-modal-close"
                onClick={() => setActiveCampaign(null)}
              >
                ✕
              </button>
            </div>

            <h2>{activeCampaign.name}</h2>
            <p className="ah-muted">
              📅 Active from {activeCampaign.startDate} through {activeCampaign.endDate}
            </p>

            <div className="ah-modal__stats">
              <div>
                <span className="ah-muted">Campaign Budget</span>
                <strong>${Number(activeCampaign.budget || 0).toLocaleString()}</strong>
              </div>
              <div>
                <span className="ah-muted">Target Return</span>
                <strong className="ah-highlight-roi">{activeCampaign.targetRoi || "3.5x"}</strong>
              </div>
              <div>
                <span className="ah-muted">Match Rating</span>
                <strong>🎯 {calculateMatchScore(activeCampaign)}%</strong>
              </div>
            </div>

            {/* Interactive Quantity & Bonus Calculator */}
            <div className="ah-modal-calculator">
              <label className="ah-calc-label">
                <span>Select Claim Quantity:</span>
                <strong>{claimQuantity} Voucher{claimQuantity > 1 ? "s" : ""}</strong>
              </label>

              <div className="ah-qty-stepper">
                <button
                  type="button"
                  className="ah-qty-btn"
                  onClick={() => setClaimQuantity(Math.max(1, claimQuantity - 1))}
                >
                  −
                </button>
                <span className="ah-qty-val">{claimQuantity}</span>
                <button
                  type="button"
                  className="ah-qty-btn"
                  onClick={() => setClaimQuantity(Math.min(10, claimQuantity + 1))}
                >
                  +
                </button>
                <span className="ah-calc-bonus">
                  🎁 Bonus Perk: +{claimQuantity * 50} Loyalty Credits
                </span>
              </div>
            </div>

            <div className="ah-modal__actions">
              <button
                type="button"
                className="ah-btn ah-btn--primary ah-btn--lg"
                onClick={() => handleBuy(activeCampaign)}
              >
                🛍️ Claim Deal ({claimQuantity}x) Now
              </button>

              <button
                type="button"
                className={`ah-btn ah-btn--ghost ${
                  bookmarkedIds.includes(activeCampaign.id) ? "ah-btn--bookmarked" : ""
                }`}
                onClick={(e) => toggleBookmark(activeCampaign.id, e)}
              >
                {bookmarkedIds.includes(activeCampaign.id) ? "★ Bookmarked" : "☆ Save for Later"}
              </button>

              <button
                type="button"
                className="ah-btn ah-btn--ghost"
                onClick={() => setActiveCampaign(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudienceView;
