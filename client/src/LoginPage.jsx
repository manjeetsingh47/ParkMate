import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { ROLE_LIST } from "./roles.js";
import { login } from "./api.js";

export default function LoginPage({ role }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ role: role.path, identifier: identifier.trim(), password });
      const store = remember ? localStorage : sessionStorage;
      store.setItem("pm_token", data.token);
      store.setItem("pm_role", role.path);
      navigate(role.redirect);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <Logo />
        <Link to="/" className="topbar-link">
          ← Back to home
        </Link>
      </header>

      <main className="split">
        {/* Left: brand panel */}
        <section className="panel">
          <span className="pill">{role.eyebrow}</span>
          <h1 className="h1">
            Park without <span className="yellow">the stress.</span>
          </h1>
          <p className="lead">
            Parking Mate helps drivers find, book and pay for a safe spot, and helps owners earn
            from space they already have.
          </p>
          <ul className="checks">
            {role.points.map((p) => (
              <li key={p}>
                <span className="tick">✓</span> {p}
              </li>
            ))}
          </ul>
        </section>

        {/* Right: form card */}
        <section className="card">
          <div className="tabs" role="tablist" aria-label="Choose account type">
            {ROLE_LIST.map((r) => (
              <NavLink
                key={r.path}
                to={`/login/${r.path}`}
                role="tab"
                className={({ isActive }) => "tab" + (isActive ? " tab-active" : "")}
              >
                {r.tab}
              </NavLink>
            ))}
          </div>

          <h2 className="h2">{role.title}</h2>
          <p className="muted">{role.subtitle}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="identifier">{role.identifierLabel}</label>
              <input
                id="identifier"
                type={role.identifierType}
                autoComplete="username"
                placeholder={role.identifierPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Keep me logged in</span>
              </label>
              <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-yellow btn-block" disabled={loading}>
              {loading ? "Logging in…" : role.button}
            </button>
          </form>

          {role.showSignup && (
            <p className="signup">
              {role.signupText}{" "}
              <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                {role.signupLabel}
              </a>
            </p>
          )}

          <p className="secure">🔒 Your details are encrypted and secure.</p>
        </section>
      </main>

      <footer className="foot">© 2026 Parking Mate. All rights reserved.</footer>
    </div>
  );
}