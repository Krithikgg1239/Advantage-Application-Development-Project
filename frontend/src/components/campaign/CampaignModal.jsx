import React, { useEffect, useState } from "react";

const emptyForm = { name: "", startDate: "", endDate: "", budget: "", targetRoi: "" };

function CampaignModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        budget: initialData.budget ?? "",
        targetRoi: initialData.targetRoi ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // JSDom does not natively block submission on `required` attributes,
    // so we explicitly verify HTML5 validity before invoking onSubmit.
    if (!e.target.checkValidity()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="ah-modal-backdrop">
      <div className="ah-modal">
        <h2>{isEditMode ? "Edit Campaign" : "Launch a New Campaign"}</h2>

        <form onSubmit={handleSubmit} className="ah-form">
          <label className="ah-field">
            <span>Campaign name</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Summer Sale 2024"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <div className="ah-field-row">
            <label className="ah-field">
              <span>Start date</span>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label className="ah-field">
              <span>End date</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="ah-field-row">
            <label className="ah-field">
              <span>Budget</span>
              <input
                type="number"
                name="budget"
                placeholder="Total Budget"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </label>
            <label className="ah-field">
              <span>Target ROI</span>
              <input
                type="number"
                name="targetRoi"
                placeholder="e.g. 2.5"
                value={formData.targetRoi}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="ah-modal__actions">
            <button type="button" className="ah-btn ah-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ah-btn ah-btn--primary">
              {isEditMode ? "UPDATE / CREATE CAMPAIGN" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CampaignModal;