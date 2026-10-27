import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchCampaigns,
  createCampaign,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
} from "../../store/slices/campaignSlice";
import CampaignModal from "./CampaignModal";
import EmptyState from "../common/EmptyState";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "PENDING_APPROVAL", "REJECTED", "EXPIRED"];

function CampaignList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.campaigns.items);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCampaigns());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = items.filter((c) => {
    const matchesSearch = (c.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (formData) => {
    const result = await dispatch(createCampaign(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Campaign created successfully!");
      setIsModalOpen(false);
    }
  };

  const handleApprove = (id) => {
    dispatch(approveCampaign(id));
    toast.success("Campaign approved.");
  };

  const handleReject = (id) => {
    dispatch(rejectCampaign(id));
    toast("Campaign rejected.");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      dispatch(deleteCampaign(id));
      toast.success("Campaign deleted.");
    }
  };

  return (
    <div className="ah-page">
      <header className="ah-page__header">
        <div>
          <h1>Campaign Management</h1>
          <p className="ah-muted">Search, filter, and act on every campaign in one place.</p>
        </div>
        {user?.role === "CLIENT" && (
          <button type="button" className="ah-btn ah-btn--primary" onClick={() => setIsModalOpen(true)}>
            Create Campaign
          </button>
        )}
      </header>

      <div className="ah-toolbar">
        <input
          type="text"
          className="ah-toolbar__search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="ah-toolbar__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No campaigns match your filters." />
      ) : (
        <div className="ah-card-grid">
          {filtered.map((c) => (
            <div key={c.id} className="ah-campaign-card">
              <div className="ah-campaign-card__top">
                <h3>{c.name}</h3>
                <span className={`ah-pill ah-pill--${(c.status || "").toLowerCase()}`}>
                  {c.status}
                </span>
              </div>

              <p className="ah-muted">
                {c.startDate} – {c.endDate}
              </p>

              <div className="ah-campaign-card__stats">
                <div>
                  <span className="ah-muted">Budget</span>
                  <strong>${Number(c.budget || 0).toLocaleString()}</strong>
                </div>
                <div>
                  <span className="ah-muted">Target ROI</span>
                  <strong>{c.targetRoi}</strong>
                </div>
                <div>
                  <span className="ah-muted">Views / Bought</span>
                  <strong>
                    {c.clickCount || 0} / {c.buyCount || 0}
                  </strong>
                </div>
              </div>

              {user?.role === "ADMANAGER" && (
                <p className="ah-muted ah-campaign-card__owner">Client: {c.clientUsername}</p>
              )}

              <div className="ah-campaign-card__actions">
                {user?.role === "ADMANAGER" && c.status === "PENDING_APPROVAL" && (
                  <>
                    <button type="button" className="ah-btn ah-btn--primary ah-btn--sm" onClick={() => handleApprove(c.id)}>
                      Approve
                    </button>
                    <button type="button" className="ah-btn ah-btn--danger ah-btn--sm" onClick={() => handleReject(c.id)}>
                      Reject
                    </button>
                  </>
                )}
                {user?.role === "ADMANAGER" && (
                  <button type="button" className="ah-btn ah-btn--ghost ah-btn--sm" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}

export default CampaignList;