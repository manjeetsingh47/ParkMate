import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Parking Mate home">
      <span className="logo-mark">P</span>
      <span className="logo-text">Parking Mate</span>
    </Link>
  );
}