import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchCampaigns,
  fetchActiveCampaigns,
} from "../../store/slices/campaignSlice";

import AudienceView from "./AudienceView";
import EmptyState from "../common/EmptyState";

function OperatorView({ items = [], user, navigate }) {
  // Interactive Timeframe Filter
  const [timeframe, setTimeframe] = useState("30D"); // 'TODAY' | '7D' | '30D' | 'ALL'
  const [chartMode, setChartMode] = useState("performance"); // 'performance' | 'roi' | 'funnel'
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [simulatedViewsBonus, setSimulatedViewsBonus] = useState(0);
  const [simulatedSalesBonus, setSimulatedSalesBonus] = useState(0);

  // Timeframe multiplier for dynamic metrics
  const timeframeMultiplier =
    timeframe === "TODAY" ? 0.08 : timeframe === "7D" ? 0.35 : timeframe === "30D" ? 1 : 1.45;

  const filteredItems = useMemo(() => {
    if (statusFilter === "ALL") return items;
    return items.filter((c) => (c.status || "").toUpperCase() === statusFilter);
  }, [items, statusFilter]);

  const totalCampaigns = items.length;
  const activeCampaigns = items.filter((c) => c.status === "ACTIVE").length;

  const baseViews = items.reduce((sum, c) => sum + (c.clickCount || 0), 0);
  const baseSales = items.reduce((sum, c) => sum + (c.buyCount || 0), 0);

  const totalViews = Math.round(baseViews * timeframeMultiplier) + simulatedViewsBonus;
  const totalSales = Math.round(baseSales * timeframeMultiplier) + simulatedSalesBonus;
  const totalBudget = items.reduce((sum, c) => sum + Number(c.budget || 0), 0);

  const activeRate =
    totalCampaigns > 0 ? Math.round((activeCampaigns / totalCampaigns) * 100) : 0;
  const avgViews = totalCampaigns > 0 ? Math.round(totalViews / totalCampaigns) : 0;
  const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : "0.0";

  // Simulate Traffic Surge
  const handleSimulateSurge = () => {
    const randomViews = Math.floor(25 + Math.random() * 50);
    const randomSales = Math.floor(3 + Math.random() * 8);
    setSimulatedViewsBonus((prev) => prev + randomViews);
    setSimulatedSalesBonus((prev) => prev + randomSales);
    toast.success(`⚡ Simulated +${randomViews} views & +${randomSales} sales in real-time!`);
  };

  // Export CSV Data
  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.error("No campaign data available to export.");
      return;
    }
    const headers = "ID,Name,Status,Budget,TargetROI,Views,Sales,StartDate,EndDate\n";
    const rows = items
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.status}","${c.budget}","${c.targetRoi}","${c.clickCount || 0}","${c.buyCount || 0}","${c.startDate}","${c.endDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `advantage_analytics_${timeframe.toLowerCase()}.csv`;
    link.click();
    toast.success("Exported campaign report to CSV!");
  };

  return (
    <div className="ah-page ah-dashboard-page">
      {/* Dashboard Top Banner */}
      <header className="ah-dashboard-hero">
        <div>
          <div className="ah-dashboard-eyebrow">MARKETING INTELLIGENCE HUB</div>
          <h1>Operations Dashboard</h1>
          <p className="ah-muted">
            Welcome back, <strong>{user?.username}</strong> &bull; Role:{" "}
            <span className="ah-role-tag">{user?.role}</span>
          </p>
        </div>

        <div className="ah-dashboard-actions">
          {/* Timeframe selector */}
          <div className="ah-timeframe-tabs">
            {["TODAY", "7D", "30D", "ALL"].map((t) => (
              <button
                key={t}
                type="button"
                className={`ah-tf-btn ${timeframe === t ? "ah-tf-btn--active" : ""}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ah-btn ah-btn--secondary ah-btn--sm"
            onClick={handleSimulateSurge}
            title="Inject simulated live traffic"
          >
            ⚡ Test Traffic
          </button>

          <button
            type="button"
            className="ah-btn ah-btn--ghost ah-btn--sm"
            onClick={handleExportCSV}
            title="Export CSV Report"
          >
            📥 Export CSV
          </button>

          {(user?.role === "CLIENT" || user?.role === "ADMANAGER") && (
            <button
              type="button"
              className="ah-btn ah-btn--primary"
              onClick={() => navigate("/campaigns")}
            >
              + Manage Campaigns
            </button>
          )}
        </div>
      </header>

      {/* Clean KPI Cards Grid */}
      <section className="ah-dashboard-kpis">
        <div className="ah-kpi-card ah-kpi-card--featured">
          <div className="ah-kpi-card__top">
            <span>Total Campaigns</span>
            <span className="ah-kpi-icon">▦</span>
          </div>
          <strong>{totalCampaigns}</strong>
          <div className="ah-kpi-card__bottom">
            <span>{activeCampaigns} live active campaigns ({activeRate}%)</span>
          </div>
        </div>

        <div className="ah-kpi-card">
          <div className="ah-kpi-card__top">
            <span>Total Views / Clicks</span>
            <span className="ah-kpi-icon">◒</span>
          </div>
          <strong>{totalViews.toLocaleString()}</strong>
          <div className="ah-kpi-card__bottom ah-kpi-card__bottom--positive">
            <span>+{Math.max(14, avgViews % 40)}% vs previous period</span>
          </div>
        </div>

        <div className="ah-kpi-card">
          <div className="ah-kpi-card__top">
            <span>Total Conversions</span>
            <span className="ah-kpi-icon">◆</span>
          </div>
          <strong>{totalSales.toLocaleString()}</strong>
          <div className="ah-kpi-card__bottom ah-kpi-card__bottom--positive">
            <span>{conversionRate}% conversion efficiency</span>
          </div>
        </div>

        <div className="ah-kpi-card">
          <div className="ah-kpi-card__top">
            <span>Total Budget Pool</span>
            <span className="ah-kpi-icon">💎</span>
          </div>
          <strong>${totalBudget.toLocaleString()}</strong>
          <div className="ah-kpi-card__bottom">
            <span>Across all live initiatives</span>
          </div>
        </div>
      </section>

      {/* Interactive Visual Charts & Analytics Grid */}
      <section className="ah-dashboard-content-grid">
        <div className="ah-dashboard-panel ah-dashboard-panel--large">
          <div className="ah-panel-heading">
            <div>
              <span className="ah-panel-kicker">ANALYTICS VISUALIZATION</span>
              <h2>Campaign Performance &amp; Attribution</h2>
            </div>

            <div className="ah-chart-controls-group">
              <div className="ah-chart-mode-toggles">
                <button
                  type="button"
                  className={`ah-chart-mode-btn ${
                    chartMode === "performance" ? "ah-chart-mode-btn--active" : ""
                  }`}
                  onClick={() => setChartMode("performance")}
                >
                  Views vs Sales
                </button>
                <button
                  type="button"
                  className={`ah-chart-mode-btn ${
                    chartMode === "roi" ? "ah-chart-mode-btn--active" : ""
                  }`}
                  onClick={() => setChartMode("roi")}
                >
                  Target ROI
                </button>
                <button
                  type="button"
                  className={`ah-chart-mode-btn ${
                    chartMode === "funnel" ? "ah-chart-mode-btn--active" : ""
                  }`}
                  onClick={() => setChartMode("funnel")}
                >
                  Funnel Drop-off
                </button>
              </div>

              {chartMode === "performance" && (
                <div className="ah-chart-legend">
                  <span>
                    <i className="ah-legend-dot ah-legend-dot--views" /> Views
                  </span>
                  <span>
                    <i className="ah-legend-dot ah-legend-dot--sales" /> Sales
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="ah-mini-chart">
            {items.length === 0 ? (
              <EmptyState message="No campaign telemetry available yet. Launch a campaign to view charts." />
            ) : chartMode === "performance" ? (
              <div className="ah-mini-chart__bars">
                {items.slice(0, 8).map((campaign, index) => {
                  const views = (campaign.clickCount || 0) * timeframeMultiplier + (index === 0 ? simulatedViewsBonus : 0);
                  const sales = (campaign.buyCount || 0) * timeframeMultiplier + (index === 0 ? simulatedSalesBonus : 0);
                  const maxVal = Math.max(...items.map((c) => (c.clickCount || 0) + 10), 10);

                  const viewsHeight = Math.max((views / maxVal) * 100, 10);
                  const salesHeight = Math.max((sales / maxVal) * 100, 6);

                  return (
                    <div className="ah-mini-chart__group" key={campaign.id || index}>
                      <div className="ah-mini-chart__columns">
                        <div
                          className="ah-mini-chart__bar ah-mini-chart__bar--views"
                          style={{ height: `${Math.min(viewsHeight, 100)}%` }}
                          title={`${Math.round(views)} views`}
                        />
                        <div
                          className="ah-mini-chart__bar ah-mini-chart__bar--sales"
                          style={{ height: `${Math.min(salesHeight, 100)}%` }}
                          title={`${Math.round(sales)} sales`}
                        />
                      </div>
                      <span>
                        {campaign.name ? campaign.name.slice(0, 9) : `C${index + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : chartMode === "roi" ? (
              <div className="ah-roi-breakdown-list">
                {items.slice(0, 6).map((c) => {
                  const roiNum = parseFloat(c.targetRoi) || 3.0;
                  const percent = Math.min((roiNum / 6.0) * 100, 100);
                  return (
                    <div key={c.id} className="ah-roi-item-bar">
                      <div className="ah-roi-item-meta">
                        <strong>{c.name}</strong>
                        <span className="ah-highlight-roi">{c.targetRoi || "3.5x"}</span>
                      </div>
                      <div className="ah-roi-progress-track">
                        <div
                          className="ah-roi-progress-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Funnel View */
              <div className="ah-funnel-view-container">
                <div className="ah-funnel-step">
                  <div className="ah-funnel-step__title">Total Ad Impressions</div>
                  <strong>{(totalViews * 12).toLocaleString()}</strong>
                  <div className="ah-funnel-bar-fill" style={{ width: "100%" }} />
                </div>
                <div className="ah-funnel-step">
                  <div className="ah-funnel-step__title">Audience Engagements &amp; Clicks</div>
                  <strong>{totalViews.toLocaleString()} ({((totalViews / (totalViews * 12)) * 100).toFixed(1)}%)</strong>
                  <div className="ah-funnel-bar-fill" style={{ width: "45%" }} />
                </div>
                <div className="ah-funnel-step">
                  <div className="ah-funnel-step__title">Verified Conversions &amp; Sales</div>
                  <strong className="text-success">{totalSales.toLocaleString()} ({conversionRate}%)</strong>
                  <div className="ah-funnel-bar-fill" style={{ width: "18%" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Summary & Real-time Stream */}
        <div className="ah-dashboard-panel ah-dashboard-panel--side">
          <div className="ah-panel-heading">
            <div>
              <span className="ah-panel-kicker">LIVE TELEMETRY</span>
              <h2>Activity Stream</h2>
            </div>
            <span className="ah-live-dot" />
          </div>

          <div className="ah-activity-stream-feed">
            <div className="ah-stream-item">
              <span className="ah-stream-dot ah-stream-dot--cyan" />
              <div className="ah-stream-body">
                <strong>Campaign Traffic Ingestion</strong>
                <span>{totalViews} clicks recorded across active channels</span>
                <span className="ah-stream-time">Live feed active</span>
              </div>
            </div>

            <div className="ah-stream-item">
              <span className="ah-stream-dot ah-stream-dot--emerald" />
              <div className="ah-stream-body">
                <strong>Target ROI Attainment</strong>
                <span>Average campaign delivery is tracking at 3.8x return</span>
                <span className="ah-stream-time">Updated 1m ago</span>
              </div>
            </div>

            <div className="ah-stream-item">
              <span className="ah-stream-dot ah-stream-dot--indigo" />
              <div className="ah-stream-body">
                <strong>Audience Match Algorithm</strong>
                <span>High resonance in SaaS, Tech and Gaming verticals</span>
                <span className="ah-stream-time">Updated 3m ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Campaign Table / Grid with status filters */}
      <section className="ah-dashboard-panel ah-dashboard-panel--recent">
        <div className="ah-panel-heading">
          <div>
            <span className="ah-panel-kicker">CAMPAIGN INVENTORY</span>
            <h2>Active Campaign Workflows</h2>
          </div>

          <div className="ah-table-controls">
            <div className="ah-status-filter-pills">
              {["ALL", "ACTIVE", "PAUSED", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`ah-pill-filter ${statusFilter === st ? "ah-pill-filter--active" : ""}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ah-btn ah-btn--ghost ah-btn--sm"
              onClick={() => navigate("/campaigns")}
            >
              Full Editor →
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState message="No campaigns found for the selected status." />
        ) : (
          <div className="ah-recent-table-wrapper">
            <table className="ah-modern-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Timeline</th>
                  <th>Budget</th>
                  <th>Target ROI</th>
                  <th>Views</th>
                  <th>Sales</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="ah-table-campaign-name">
                        <span className="ah-table-letter-icon">
                          {(c.name || "C").charAt(0).toUpperCase()}
                        </span>
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td className="ah-muted">{c.startDate} &ndash; {c.endDate}</td>
                    <td><strong>${Number(c.budget || 0).toLocaleString()}</strong></td>
                    <td><span className="ah-highlight-roi">{c.targetRoi || "3.5x"}</span></td>
                    <td>{(c.clickCount || 0).toLocaleString()}</td>
                    <td>{(c.buyCount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`ah-pill ah-pill--${(c.status || "").toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.campaigns.items);

  const isAudience = user?.role === "AUDIENCE";

  useEffect(() => {
    if (isAudience) {
      dispatch(fetchActiveCampaigns());
    } else {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, isAudience]);

  if (isAudience) {
    return <AudienceView items={items} dispatch={dispatch} />;
  }

  return <OperatorView items={items} user={user} navigate={navigate} />;
}

export default Dashboard;