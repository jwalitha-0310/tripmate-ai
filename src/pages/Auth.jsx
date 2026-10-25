import { useState } from "react";
import { Plane, Mail, Lock, User, ArrowRight } from "lucide-react";
import { loginUser, registerUser } from "../services/authService";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin) {
        await registerUser(name, email, password);
      }

      const data = await loginUser(email, password);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <Plane size={28} />
        </div>

        {/* Heading */}
        <h1 className="auth-title">Tripmate-AI</h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Welcome back! Your next adventure awaits."
            : "Create an account and start exploring the world."}
        </p>

        <h2 className="auth-form-title">
          {isLogin ? "Login to your account" : "Create your account"}
        </h2>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>

              <div className="auth-input-wrapper">
                <User size={18} />

                <input
                  id="auth-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>

            <div className="auth-input-wrapper">
              <Mail size={18} />

              <input
                id="auth-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>

            <div className="auth-input-wrapper">
              <Lock size={18} />

              <input
                id="auth-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Switch between login and register */}
        <p className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <div className="auth-footer">
          🌍 Plan smarter. Travel better.
        </div>

      </div>
    </div>
  );
}

export default Auth;