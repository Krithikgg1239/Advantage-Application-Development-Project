import React from "react";

function EmptyState({ message = "Nothing to show here yet." }) {
  return (
    <div className="ah-empty-state">
      <div className="ah-empty-state__glyph">◇</div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;