
import { Link, NavLink } from "react-router-dom";
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

        {/* Parking Mate Logo */}
        <Link to="/" className="logo">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40"
              height="40"
              rx="11"
              fill="#D4AF37"
            />
            <path
              d="M13 31V9H22C28 9 31 12 31 18C31 24 27 27 21 27H18V31H13ZM18 22H21C24 22 26 21 26 18C26 15 24 14 21 14H18V22Z"
              fill="#080808"
            />
          </svg>

          <span>
            Parking <span>Mate</span>
          </span>
        </Link>

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

          <Link to="/find-parking" className="nav-btn">
            Book Parking
          </Link>
        </div>

      </div>
    </header>
  );
}
