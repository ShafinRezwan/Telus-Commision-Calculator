import React, { useState } from "react";
import "../css/register.css";
import { supabase } from "../types/supaBaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Password does not meet all requirements.");
      setSuccess(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: username },
      },
    });

    if (error) {
      setError(error.message);
      setSuccess(false);
    } else {
      setError(null);
      setSuccess(true);
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          className="register-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          className="register-input"
          placeholder="Display Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="password-input-wrapper">
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(false)}
            required
          />

          {showPasswordRules && (
            <div className="password-popup">
              <p className={passwordRules.length ? "valid" : "invalid"}>
                ✔ At least 8 characters
              </p>
              <p className={passwordRules.upper ? "valid" : "invalid"}>
                ✔ At least 1 uppercase letter
              </p>
              <p className={passwordRules.lower ? "valid" : "invalid"}>
                ✔ At least 1 lowercase letter
              </p>
              <p className={passwordRules.number ? "valid" : "invalid"}>
                ✔ At least 1 number
              </p>
              <p className={passwordRules.special ? "valid" : "invalid"}>
                ✔ At least 1 special character
              </p>
            </div>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && (
          <p className="form-success">
            Check your email to confirm your registration!
          </p>
        )}
        <button
          type="submit"
          className="register-submit"
          disabled={!isPasswordValid}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
