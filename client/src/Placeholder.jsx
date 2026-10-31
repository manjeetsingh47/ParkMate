import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Placeholder({ name }) {
  return (
    <div className="center-page">
      <Logo />
      <h1 className="h1">{name}</h1>
      <p className="muted">You are logged in. Build this page next.</p>
      <Link to="/login/customer" className="btn btn-green">
        Back to log in
      </Link>
    </div>
  );
}
