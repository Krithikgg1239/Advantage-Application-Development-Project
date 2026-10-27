import React from "react";
import { Toaster } from "react-hot-toast";

function NotificationStack({ notifications = [] }) {
  return (
    <div className="ah-notification-stack" data-testid="notification-stack">
      <Toaster position="top-right" />
      {notifications.map((n) => (
        <div
          key={n.id}
          role="status"
          data-testid={`notification-${n.type}`}
          className={`ah-notification ah-notification--${n.type}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationStack;