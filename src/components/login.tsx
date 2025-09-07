import React, { useState } from "react";
import "../css/login.css";
import { supabase } from "../types/supaBaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Attempting login with email:", email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        setLoading(false);
        setSuccess(false);
        return; // Don't navigate if there's an error
      }

      if (data.user) {
        console.log("Login successful for user:", data.user.email);
        setError(null);
        setSuccess(true);
        setLoading(false);
        
        // Only navigate after successful login
        setTimeout(() => {
          navigate("/calculate");
        }, 1000); // Small delay to show success message
      } else {
        console.log("No user data returned");
        setError("Login failed - no user data returned");
        setLoading(false);
        setSuccess(false);
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      setSuccess(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    try {
      console.log("Attempting password reset for email:", resetEmail.trim());
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      console.log("Password reset response:", { error });

      if (error) {
        console.error("Password reset error:", error);
        setResetError(error.message);
        setResetLoading(false);
        setResetSuccess(false);
      } else {
        console.log("Password reset email sent successfully");
        setResetError(null);
        setResetSuccess(true);
        setResetLoading(false);
        setResetEmail("");
      }
    } catch (err: any) {
      console.error("Unexpected password reset error:", err);
      setResetError("An unexpected error occurred. Please try again.");
      setResetLoading(false);
      setResetSuccess(false);
    }
  };

  const toggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
    setResetEmail("");
    setResetError(null);
    setResetSuccess(false);
  };

  return (
    <div className="login-wrapper">
      {!showResetPassword ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">Login successful!</p>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <button 
            type="button" 
            className="forgot-password-btn" 
            onClick={toggleResetPassword}
          >
            Forgot Password?
          </button>
        </form>
      ) : (
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          <h3 className="reset-title">Reset Password</h3>
          <p className="reset-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          
          {resetError && <p className="form-error">{resetError}</p>}
          {resetSuccess && (
            <p className="form-success">
              Password reset email sent! Check your inbox and follow the instructions.
            </p>
          )}

          <div className="reset-buttons">
            <button type="submit" className="reset-submit-btn" disabled={resetLoading}>
              {resetLoading ? "Sending..." : "Send Reset Email"}
            </button>
            
            <button 
              type="button" 
              className="back-to-login-btn" 
              onClick={toggleResetPassword}
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
