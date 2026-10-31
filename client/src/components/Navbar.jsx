
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo.jsx";
import "./Navbar.css";

const links = [
  { to: "/find-parking", label: "Find Parking" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/list-your-space", label: "List Your Space" },
  { to: "/pricing", label: "Pricing" },
  { to: "/help", label: "Help" },
];

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">

        <Logo tone="light" />

        {/* Navigation Links */}
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="nav-right">
          <Link to="/login/customer">
            Login
          </Link>

          <Link to="/login/customer" className="nav-btn">
            Sign up
          </Link>
        </div>

      </div>
    </header>
  );
}
