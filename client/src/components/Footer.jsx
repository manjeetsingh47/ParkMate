
import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <Logo tone="light" />
          </div>

          <p>
            Your parking, made simple. Find secure parking spaces,
            book easily and enjoy a stress-free journey with ParkMate.
          </p>
        </div>

        {/* Footer Links */}
        <div className="footer-cols">

          <div>
            <h4>Company</h4>
            <Link to="/">Home</Link>
            <Link to="/#about">About Us</Link>
            <Link to="/help">Contact Us</Link>
          </div>

          <div>
            <h4>Services</h4>
            <Link to="/find-parking">Find Parking</Link>
            <Link to="/list-your-space">List Your Space</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div>
            <h4>Account</h4>
            <Link to="/login/customer">User Login</Link>
            <Link to="/login/host">Owner Login</Link>
            <Link to="/login/admin">Admin Login</Link>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copy">
        © 2026 ParkMate. All rights reserved.
      </div>
    </footer>
  );
}
