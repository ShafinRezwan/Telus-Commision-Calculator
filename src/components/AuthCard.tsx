// src/components/AuthCard.tsx
import React from "react";
import "..//css/authlanding.css";

interface AuthCardProps {
  children: React.ReactNode;
  mode: "landing" | "register" | "login";
}

const AuthCard: React.FC<AuthCardProps> = ({ children, mode }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="icon-wrapper">
          <div
            className={`user-icon-circle ${
              mode === "login" ? "purple" : "green"
            }`}
          >
            <svg
              className="user-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthCard;
