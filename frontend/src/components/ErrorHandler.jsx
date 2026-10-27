import React from "react";

function ErrorHandler({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div className="ah-error-banner" role="alert" data-testid="error-banner">
      <span className="ah-error-dot" aria-hidden="true" />
      <span>{error}</span>
    </div>
  );
}

export default ErrorHandler;