
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
} from "react-router-dom";

import Icon from "./Icon.jsx";
import { ParkLogo, SideArt } from "./Brand.jsx";
import { USER } from "./data.js";
import "./dashboard.css";

const DashboardLocationContext = createContext(null);

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
  { to: "/customer/bookings", label: "My Bookings", icon: "calendar" },
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

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

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
          searchScope: "radius",
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

  const first = USER.name.trim()[0] || "?";

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
                  "nav-item" + (isActive ? " nav-active" : "")
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
