import { Link } from "react-router-dom";

/* ParkMate logo: green map-pin with a P.
   tone="dark"  -> for light backgrounds (login top bar)
   tone="light" -> for navy backgrounds (navbar, footer) */
export default function Logo({ tone = "dark", to = "/" }) {
  return (
    <Link to={to} className={"pm-logo pm-logo-" + tone} aria-label="ParkMate home">
      <svg viewBox="0 0 56 62" aria-hidden="true">
        <defs>
          <linearGradient id="pm-logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1fd1a0" />
            <stop offset="1" stopColor="#12a35b" />
          </linearGradient>
        </defs>
        <path d="M28 3C15 3 5 12.6 5 24.6 5 38.5 22 52 28 59c6-7 23-20.5 23-34.4C51 12.6 41 3 28 3z" fill="url(#pm-logo-g)" />
        <circle cx="28" cy="24" r="14.5" fill="#0a1736" />
        <path d="M22.5 33V15.5h7.2a5.7 5.7 0 0 1 0 11.4h-3.6" fill="none" stroke="#2ee07f" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="pm-logo-text">
        Park<b>Mate</b>
      </span>
    </Link>
  );
}
