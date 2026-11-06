
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Icon from "./Icon.jsx";
import { ParkLogo, SideArt } from "./Brand.jsx";
import { USER } from "./data.js";
import "./dashboard.css";

// Shared location context
const DashboardLocationContext = createContext(null);

// Access shared location from any customer dashboard page
export function useDashboardLocation() {
  const context = useContext(DashboardLocationContext);

  if (!context) {
    throw new Error(
      "useDashboardLocation must be used inside DashboardLayout"
    );
  }

  return context;
}

const NAV = [
  { to: "/customer/dashboard", label: "Home", icon: "home" },
  { to: "/customer/find", label: "Find Parking", icon: "search" },
  { to: "/customer/bookings", label: "My Bookings", icon: "calendar" },
  { to: "/customer/payments", label: "Wallet", icon: "wallet" },
  { to: "/customer/profile", label: "Settings", icon: "settings" },
];

function isLoggedIn() {
  try {
    return !!(
      localStorage.getItem("pm_token") ||
      sessionStorage.getItem("pm_token")
    );
  } catch {
    return false;
  }
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [q, setQ] = useState("");

  // Shared selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Location detection states
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Select a manually searched location or GPS location
  const selectLocation = useCallback((place) => {
    if (
      !place ||
      !Number.isFinite(Number(place.lat)) ||
      !Number.isFinite(Number(place.lng))
    ) {
      setLocationError("Please select a valid location.");
      return;
    }

    setSelectedLocation({
      ...place,
      lat: Number(place.lat),
      lng: Number(place.lng),
    });

    setLocationError("");
  }, []);

  // Detect user's current GPS location
  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(
        "Your browser does not support location services."
      );
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setSelectedLocation({
          id: "current-location",
          name: "Current Location",
          city: "",
          state: "",
          country: "",
          address: "Your current location",
          lat: latitude,
          lng: longitude,
          accuracy,
          source: "gps",
        });

        setLocationLoading(false);
        setLocationError("");
      },

      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your current location could not be detected."
          );
        } else {
          setLocationError(
            "Location request timed out. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setLocationError("");
  }, []);

  // Shared data available to Home and Find Parking
  const locationContextValue = useMemo(
    () => ({
      selectedLocation,
      selectLocation,
      detectCurrentLocation,
      clearLocation,
      locationLoading,
      locationError,
      setLocationError,
    }),
    [
      selectedLocation,
      selectLocation,
      detectCurrentLocation,
      clearLocation,
      locationLoading,
      locationError,
    ]
  );

  // Not logged in -> back to login
  if (!isLoggedIn()) {
    return <Navigate to="/login/customer" replace />;
  }

  function logout() {
    try {
      ["pm_token", "pm_role"].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    } catch {
      // Ignore storage errors
    }

    navigate("/login/customer");
  }

  function search(e) {
    e.preventDefault();

    navigate(
      "/customer/find" +
        (q.trim()
          ? "?q=" + encodeURIComponent(q.trim())
          : "")
    );
  }

  const first = USER.name.trim()[0] || "?";

  // Keep Find Parking active while inside booking pages
  const inBooking = pathname.startsWith("/customer/book/");

  return (
    <DashboardLocationContext.Provider value={locationContextValue}>
      <div className="dash">
        <aside className="side">
          <div className="side-logo">
            <ParkLogo />
          </div>

          <nav className="side-nav" aria-label="Dashboard">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "nav-item" +
                  (
                    isActive ||
                    (inBooking && item.to === "/customer/find")
                      ? " nav-active"
                      : ""
                  )
                }
              >
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            className="nav-item logout"
            onClick={logout}
            type="button"
          >
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

            <form
              className="dsearch"
              onSubmit={search}
              role="search"
            >
              <Icon name="search" size={21} />

              <input
                type="text"
                aria-label="Search for parking"
                placeholder="Search parking spots..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </form>

            <div className="dtop-right">
              <button
                className="bell"
                type="button"
                aria-label="Notifications"
              >
                <Icon name="bell" size={24} />
                <i />
              </button>

              <button
                className="dtop-user"
                type="button"
                onClick={() => navigate("/customer/profile")}
                aria-label="Open settings"
              >
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
    </DashboardLocationContext.Provider>
  );
}
