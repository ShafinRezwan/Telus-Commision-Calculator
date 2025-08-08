import React, { useState } from "react";
import "../css/authlanding.css";
import Register from "./Register";
import AuthCard from "./AuthCard";
import Login from "./login";

const AuthLanding: React.FC = () => {
  const [mode, setMode] = useState<"landing" | "register" | "login">("landing");

  const renderContent = () => {
    if (mode === "register") {
      return (
        <>
          <Register></Register>
          <button className="back-btn" onClick={() => setMode("landing")}>
            Back
          </button>
        </>
      );
    }

    if (mode === "login") {
      return (
        <>
          <Login></Login>
          <button className="back-btn" onClick={() => setMode("landing")}>
            Back
          </button>
        </>
      );
    }

    // Default landing view
    return (
      <>
        <div className="button-group">
          <button className="register-btn" onClick={() => setMode("register")}>
            Register
          </button>
          <button className="login-btn" onClick={() => setMode("login")}>
            Login
          </button>
        </div>
      </>
    );
  };

  return <AuthCard mode={mode}>{renderContent()}</AuthCard>;
};
export default AuthLanding;
