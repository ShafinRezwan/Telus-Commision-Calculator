import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../types/supaBaseClient";
import "../css/login.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <div className="login-wrapper">
        <div className="reset-password-form">
          <h3 className="reset-title">Reset Password</h3>
          <p className="form-error">{error}</p>
          <button 
            className="back-to-login-btn" 
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-wrapper">
        <div className="reset-password-form">
          <h3 className="reset-title">Password Updated!</h3>
          <p className="form-success">
            Your password has been successfully updated. You will be redirected to the login page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h3 className="reset-title">Set New Password</h3>
        <p className="reset-description">
          Please enter your new password below.
        </p>
        
        <input
          className="login-input"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        
        <input
          className="login-input"
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        
        {error && <p className="form-error">{error}</p>}

        <div className="reset-buttons">
          <button type="submit" className="reset-submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
          
          <button 
            type="button" 
            className="back-to-login-btn" 
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
