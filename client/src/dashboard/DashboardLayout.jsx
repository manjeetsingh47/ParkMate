import { useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon.jsx";
import { ParkLogo, SideArt } from "./Brand.jsx";
import { USER } from "./data.js";
import "./dashboard.css";

const NAV = [
  { to: "/customer/dashboard", label: "Home", icon: "home" },
  { to: "/customer/find", label: "Find Parking", icon: "search" },
  { to: "/customer/bookings", label: "My Bookings", icon: "calendar" },
  { to: "/customer/payments", label: "Wallet", icon: "wallet" },
  { to: "/customer/profile", label: "Settings", icon: "settings" },
];

function isLoggedIn() {
  try {
    return !!(localStorage.getItem("pm_token") || sessionStorage.getItem("pm_token"));
  } catch {
    return false;
  }
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState("");

  // Not logged in -> back to login
  if (!isLoggedIn()) return <Navigate to="/login/customer" replace />;

  function logout() {
    try {
      ["pm_token", "pm_role"].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch {
      /* ignore */
    }
    navigate("/login/customer");
  }

  function search(e) {
    e.preventDefault();
    navigate("/customer/find" + (q.trim() ? "?q=" + encodeURIComponent(q.trim()) : ""));
  }

  const first = USER.name.trim()[0] || "?";
  // keep "Find Parking" lit while the person is inside the booking pages
  const inBooking = pathname.startsWith("/customer/book/");

  return (
    <div className="dash">
      <aside className="side">
        <div className="side-logo">
          <ParkLogo />
        </div>
        <nav className="side-nav" aria-label="Dashboard">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                "nav-item" + (isActive || (inBooking && n.to === "/customer/find") ? " nav-active" : "")
              }
            >
              <Icon name={n.icon} size={22} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout" onClick={logout}>
          <Icon name="logout" size={22} />
          <span>Log out</span>
        </button>
        <div className="side-foot">
          <SideArt />
          <p>
            Park Smart.
            <br />
            <b>Move Better.</b>
          </p>
        </div>
      </aside>

      <div className="main">
        <header className="dtop">
          <span className="dtop-logo">
            <ParkLogo size={30} />
          </span>
          <form className="dsearch" onSubmit={search} role="search">
            <Icon name="search" size={21} />
            <input type="text" aria-label="Search for locations" placeholder="Search for locations..." value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <div className="dtop-right">
            <button className="bell" aria-label="Notifications">
              <Icon name="bell" size={24} />
              <i />
            </button>
            <button className="dtop-user" onClick={() => navigate("/customer/profile")} aria-label="Open settings">
              <span className="avatar">{first}</span>
              <span className="dtop-name">{USER.name}</span>
              <Icon name="caret" size={15} stroke={2.6} />
            </button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
