import { useState } from "react";
import "./signup.css";

const COPY = {
  user: {
    badge: "🚗 Smarter Parking Solution",
    headline: (
      <>
        Park without
        <br />
        the <em>stress.</em>
      </>
    ),
    lead: "ParkMate helps drivers find, book and pay for a safe spot, and helps owners earn from space they already have.",
    features: [
      ["⚡", "Real-time availability"],
      ["🛡", "Safe & Secure payments"],
      ["📍", "Find nearby parking"],
    ],
    title: "Create Account",
    subtitle: "Join ParkMate and start booking your parking spots today!",
    button: "Create Account →",
  },
  owner: {
    badge: "🅿 Earn from your space",
    headline: (
      <>
        Turn empty space
        <br />
        into <em>income.</em>
      </>
    ),
    lead: "List your parking area on ParkMate, manage bookings in real time and get paid securely for every spot you rent out.",
    features: [
      ["💰", "Earn on unused space"],
      ["📊", "Manage bookings & slots"],
      ["🛡", "Safe & secure payouts"],
    ],
    title: "Create Owner Account",
    subtitle: "List your parking space and start earning with ParkMate!",
    button: "Create Owner Account →",
  },
};

const EMPTY = {
  fullName: "",
  email: "",
  countryCode: "+91",
  mobile: "",
  parkingName: "",
  city: "",
  totalSlots: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

function Icon({ children }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

export default function Signup({ initialRole = "user" }) {
  const [role, setRole] = useState(() =>
    window.location.hash === "#owner" ? "owner" : initialRole
  );
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [msg, setMsg] = useState({ text: "", ok: false });

  const c = COPY[role];

  const change = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const switchRole = (next) => {
    setRole(next);
    setMsg({ text: "", ok: false });
    window.history.replaceState(null, "", "#" + next);
  };

  const fail = (text) => setMsg({ text, ok: false });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return fail("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return fail("Enter a valid email address.");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return fail("Enter a valid 10-digit mobile number.");
    if (role === "owner") {
      if (!form.parkingName.trim()) return fail("Enter your parking space name.");
      if (!form.city.trim()) return fail("Enter the city.");
      if (!(Number(form.totalSlots) > 0)) return fail("Enter the total number of slots.");
    }
    if (form.password.length < 8) return fail("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return fail("Passwords do not match.");
    if (!form.terms) return fail("Please accept the Terms & Privacy Policy.");

    const { confirmPassword, terms, ...data } = form;
    const payload = { ...data, role };
    if (role === "user") {
      delete payload.parkingName;
      delete payload.city;
      delete payload.totalSlots;
    }

    // TODO: connect your backend (for example, a function from src/api.js)
    // await registerUser(payload);
    console.log("Registering:", payload);
    setMsg({ text: "Account details look good. Connect your API in Signup.jsx.", ok: true });
  };

  return (
    <div className="sp">
      <header className="sp-topbar">
        <a href="/" className="sp-logo">
          <div className="sp-logo-mark"><b>P</b></div>
          <span className="sp-logo-text">Park<span>Mate</span></span>
        </a>
        <a href="/" className="sp-back">← Back to home</a>
      </header>

      <main className="sp-split">
        <section className="sp-hero" aria-live="polite">
          <div className="sp-badge">{c.badge}</div>
          <h1>{c.headline}</h1>
          <p>{c.lead}</p>
          <ul className="sp-features">
            {c.features.map(([icon, label]) => (
              <li key={label}>
                <span className="sp-ico">{icon}</span>
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section className="sp-panel">
          <div className="sp-tabs" role="tablist">
            <button type="button" role="tab" className="sp-tab" aria-selected={role === "user"} onClick={() => switchRole("user")}>
              👤 User
            </button>
            <button type="button" role="tab" className="sp-tab" aria-selected={role === "owner"} onClick={() => switchRole("owner")}>
              🚘 Parking Owner
            </button>
          </div>

          <div className="sp-progress"><i /></div>
          <h2>{c.title}</h2>
          <p className="sp-subtitle">{c.subtitle}</p>

          <form className="sp-form" onSubmit={submit} noValidate>
            <label className="sp-field">
              <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Icon>
              <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={change} autoComplete="name" />
            </label>

            <label className="sp-field">
              <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={change} autoComplete="email" />
            </label>

            <div className="sp-field">
              <Icon><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>
              <select className="sp-code" name="countryCode" value={form.countryCode} onChange={change} aria-label="Country code">
                <option>+91</option><option>+1</option><option>+44</option><option>+971</option>
              </select>
              <input type="tel" name="mobile" placeholder="Mobile Number" maxLength={10} value={form.mobile} onChange={change} autoComplete="tel-national" />
            </div>

            {role === "owner" && (
              <>
                <label className="sp-field">
                  <Icon><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></Icon>
                  <input type="text" name="parkingName" placeholder="Parking Space Name" value={form.parkingName} onChange={change} />
                </label>
                <div className="sp-row2">
                  <label className="sp-field">
                    <input type="text" name="city" placeholder="City" value={form.city} onChange={change} />
                  </label>
                  <label className="sp-field">
                    <input type="number" name="totalSlots" placeholder="Total Slots" min="1" value={form.totalSlots} onChange={change} />
                  </label>
                </div>
              </>
            )}

            {["password", "confirmPassword"].map((name) => (
              <label className="sp-field" key={name}>
                <Icon><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Icon>
                <input
                  type={show[name] ? "text" : "password"}
                  name={name}
                  placeholder={name === "password" ? "Password" : "Confirm Password"}
                  value={form[name]}
                  onChange={change}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="sp-toggle"
                  aria-label={show[name] ? "Hide password" : "Show password"}
                  style={{ opacity: show[name] ? 0.5 : 1 }}
                  onClick={() => setShow((s) => ({ ...s, [name]: !s[name] }))}
                >
                  👁
                </button>
              </label>
            ))}

            <label className="sp-terms">
              <input type="checkbox" name="terms" checked={form.terms} onChange={change} />
              <span>I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a></span>
            </label>

            <div className={"sp-msg" + (msg.ok ? " ok" : "")} role="alert">{msg.text}</div>

            <button type="submit" className="sp-primary">{c.button}</button>

            {role === "user" && (
              <>
                <div className="sp-divider">or</div>
                <div className="sp-social">
                  <button type="button" className="sp-social-btn"><b style={{ color: "#4285F4" }}>G</b> Continue with Google</button>
                  <button type="button" className="sp-social-btn">Continue with Apple</button>
                </div>
              </>
            )}

            <p className="sp-login">Already have an account? <a href="/login">Login</a></p>
          </form>
        </section>
      </main>
    </div>
  );
}