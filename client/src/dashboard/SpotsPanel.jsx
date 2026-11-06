
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import { SpotArt } from "./Art.jsx";
import { SPOTS, inr } from "./data.js";
import { useDashboardLocation } from "./DashboardLayout.jsx";

export function SpotCard({ spot, showTags = false }) {
  const navigate = useNavigate();
  const low = spot.free <= 3;

  const distance =
    spot.distanceKm !== null && spot.distanceKm !== undefined
      ? Number(spot.distanceKm).toFixed(1)
      : Number(spot.km).toFixed(1);

  return (
    <article className="scard">
      <div className="scard-img">
        <SpotArt kind={spot.art} img={spot.img} alt={spot.name} />
        <span className="rate-badge">
          <Icon name="star" size={15} filled stroke={0} /> {spot.rating}
        </span>
      </div>

      <div className="scard-body">
        <h3>{spot.name}</h3>
        <p className="scard-meta">
          <Icon name="pin" size={15} filled stroke={0} />
          {spot.area}
          <i>•</i>
          {distance} km away
        </p>

        {showTags && (
          <div className="tags">
            {spot.covered && <span className="tag">Covered</span>}
            {spot.ev && <span className="tag">EV charging</span>}
            {spot.open24 && <span className="tag">24x7</span>}
          </div>
        )}

        <div className="scard-foot">
          <div>
            <div className="price">
              {inr(spot.price)}
              <small>/hr</small>
            </div>
            <span className={"slots" + (low ? " low" : "")}>
              {spot.free} of {spot.total} slots free
            </span>
          </div>

          <button
            className="btn btn-green"
            onClick={() => navigate("/customer/book/" + spot.id)}
          >
            <Icon name="calcheck" size={17} /> Book
          </button>
        </div>
      </div>
    </article>
  );
}

const SORTS = {
  distance: "Distance",
  price: "Price",
  rating: "Rating",
};

function getPlaceDetails(feature) {
  const properties = feature.properties || {};
  const coordinates = feature.geometry?.coordinates || [];
  const [lng, lat] = coordinates;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const city =
    properties.city ||
    properties.town ||
    properties.village ||
    properties.county ||
    "";

  const state = properties.state || "";
  const country = properties.country || "";

  const name =
    properties.name ||
    properties.street ||
    city ||
    properties.county ||
    "Selected location";

  const address = [
    properties.name,
    properties.street,
    properties.district,
    city,
    state,
    country,
  ]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(", ");

  return {
    id: properties.osm_id
      ? `${properties.osm_type || "osm"}-${properties.osm_id}`
      : `${lat}-${lng}`,
    name,
    city,
    state,
    country,
    address,
    lat,
    lng,
    source: "manual",
  };
}

export default function SpotsPanel({
  spots = SPOTS,
  showTags = false,
  showCount = false,
  extra = null,
  homeMode = false,
}) {
  const navigate = useNavigate();

  const {
    selectedLocation,
    selectLocation,
    detectCurrentLocation,
    locationLoading,
    locationError,
    setLocationError,
  } = useDashboardLocation();

  const [sort, setSort] = useState("distance");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);
  const timerRef = useRef(null);
  const requestRef = useRef(0);

  const locationLabel = selectedLocation
    ? [
        selectedLocation.name,
        selectedLocation.city,
        selectedLocation.state,
        selectedLocation.country,
      ]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(", ")
    : "";

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 3) {
      setSuggestions([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    const requestId = ++requestRef.current;
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            query
          )}&limit=7&lang=en`
        );

        if (!response.ok) throw new Error("Location search failed.");

        const data = await response.json();

        if (requestId !== requestRef.current) return;

        const results = (data.features || [])
          .map(getPlaceDetails)
          .filter(Boolean);

        setSuggestions(results);
        setShowSuggestions(true);

        if (results.length === 0) {
          setSearchError("No matching locations found. Try another search.");
        }
      } catch {
        if (requestId === requestRef.current) {
          setSuggestions([]);
          setSearchError(
            "Unable to search locations. Please check your internet connection."
          );
        }
      } finally {
        if (requestId === requestRef.current) {
          setSearchLoading(false);
        }
      }
    }, 450);

    return () => clearTimeout(timerRef.current);
  }, [searchText]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectLocation(place) {
    selectLocation(place);
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError("");
  }

  function handleCurrentLocation() {
    setLocationError("");
    setShowSuggestions(false);
    detectCurrentLocation();
  }

  const list = useMemo(() => {
    const filtered = [...spots];

    return filtered.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;

      const distanceA =
        a.distanceKm !== null && a.distanceKm !== undefined
          ? a.distanceKm
          : a.km;

      const distanceB =
        b.distanceKm !== null && b.distanceKm !== undefined
          ? b.distanceKm
          : b.km;

      return distanceA - distanceB;
    });
  }, [spots, sort]);

  return (
    <section className="bigpanel">
      {homeMode ? (
        <div
          style={{
            padding: "26px",
            marginBottom: "22px",
            borderRadius: "18px",
            background: "#020c43",
            border: "1px solid #05940f",
            boxShadow: "0 8px 24px rgba(10, 23, 54, 0.16)",
          }}
        >
          <div style={{ marginBottom: "18px" }}>
            <h2
              style={{
                margin: "0 0 6px",
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Discover Nearby Parking
            </h2>
            <p
              style={{
                margin: 0,
                color: "#c4d2e5",
                fontSize: "13px",
              }}
            >
              Find the perfect parking spot near your destination.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              ref={searchRef}
              style={{
                position: "relative",
                flex: "1 1 320px",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0 16px",
                height: "54px",
                border: "1px solid #b8d2e8",
                borderRadius: "12px",
                background: "#f4f9fe",
                boxShadow: "0 2px 7px rgba(16,43,78,0.06)",
              }}
            >
              <Icon name="map-pin" size={20} color="#0b8a4a" />

              <input
                type="text"
                value={searchText}
                placeholder={locationLabel || "Enter your location"}
                aria-label="Search city, area or landmark"
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setShowSuggestions(false);

                  if (event.key === "Enter" && suggestions.length > 0) {
                    event.preventDefault();
                    handleSelectLocation(suggestions[0]);
                  }
                }}
                style={{
                  width: "100%",
                  minWidth: 0,
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#102b4e",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              />

              {searchText && (
                <button
                  type="button"
                  aria-label="Clear location search"
                  onClick={() => {
                    setSearchText("");
                    setSuggestions([]);
                    setSearchError("");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="close" size={16} />
                </button>
              )}

              {showSuggestions && searchText.trim().length >= 3 && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #dce8f2",
                    borderRadius: "12px",
                    boxShadow: "0 12px 35px rgba(16,43,78,0.14)",
                    padding: "8px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {searchLoading && (
                    <p style={{ padding: "10px", color: "#64748b" }}>
                      Searching locations...
                    </p>
                  )}

                  {!searchLoading &&
                    suggestions.map((place) => (
                      <button
                        type="button"
                        key={place.id}
                        onClick={() => handleSelectLocation(place)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "11px",
                          border: "none",
                          borderRadius: "9px",
                          background: "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <Icon name="map-pin" size={17} color="#0b8a4a" />
                        <span>
                          <strong
                            style={{
                              display: "block",
                              color: "#102b4e",
                              fontSize: "14px",
                            }}
                          >
                            {place.name}
                          </strong>
                          <small style={{ color: "#64748b" }}>
                            {[place.city, place.state, place.country]
                              .filter(Boolean)
                              .join(", ")}
                          </small>
                        </span>
                      </button>
                    ))}

                  {!searchLoading && searchError && (
                    <p style={{ padding: "10px", color: "#64748b" }}>
                      {searchError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-green"
              onClick={handleCurrentLocation}
              disabled={locationLoading}
              style={{
                height: "54px",
                padding: "0 20px",
                whiteSpace: "nowrap",
              }}
            >
              <Icon name="crosshair" size={17} />
              {locationLoading ? "Locating..." : "Use My Location"}
            </button>
          </div>

          {extra && (
            <div
              style={{
                marginTop: "18px",
                paddingTop: "16px",
                borderTop: "1px solid #31415e",
              }}
            >
              {extra}
            </div>
          )}
        </div>
      ) : (
        <div className="toolbar">
          <div
            className="pick pick-loc"
            style={{
              position: "relative",
              flex: "1 1 320px",
              minWidth: 0,
              cursor: "default",
            }}
          >
            <span className="pick-ico">
              <Icon name="pin" size={20} filled stroke={0} />
            </span>

            <div
              ref={searchRef}
              style={{ flex: 1, minWidth: 0, position: "relative" }}
            >
              <small
                style={{
                  display: "block",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Your Selected Location
              </small>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  value={searchText}
                  placeholder={locationLabel || "Choose your location"}
                  aria-label="Search city, area or landmark"
                  autoComplete="off"
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setShowSuggestions(false);
                    if (event.key === "Enter" && suggestions.length > 0) {
                      event.preventDefault();
                      handleSelectLocation(suggestions[0]);
                    }
                  }}
                  style={{
                    width: "100%",
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#102b4e",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                />
                {searchText && (
                  <button
                    type="button"
                    aria-label="Clear location search"
                    onClick={() => {
                      setSearchText("");
                      setSuggestions([]);
                      setSearchError("");
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={locationLoading}
              title="Use your current GPS location"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 10px",
                border: "1px solid #dce8f2",
                borderRadius: "9px",
                background: "#f0f8f4",
                color: "#0b8a4a",
                fontSize: "12px",
                fontWeight: 700,
                cursor: locationLoading ? "wait" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon name="crosshair" size={16} />
              {locationLoading ? "Locating..." : "Current"}
            </button>
          </div>

          <label className="pick pick-sort">
            <Icon name="filter" size={19} stroke={2.2} />
            <span className="pick-sorttxt">
              Sort by: <b>{SORTS[sort]}</b>
            </span>
            <Icon name="caret" size={15} stroke={2.6} />
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {Object.entries(SORTS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {(locationError || searchError) && (
        <p
          role="alert"
          style={{
            margin: "10px 0",
            color: "#b45309",
            fontSize: "13px",
          }}
        >
          {locationError || searchError}
        </p>
      )}

      {!homeMode && selectedLocation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            padding: "10px 14px",
            margin: "10px 0",
            background: "#edf7f1",
            borderRadius: "9px",
            color: "#087443",
            fontSize: "13px",
          }}
        >
          <span>
            <Icon name="check-circle" size={15} /> Searching around{" "}
            <strong>{locationLabel}</strong>
          </span>
          <button
            type="button"
            onClick={() => navigate("/customer/find")}
            style={{
              border: "none",
              background: "transparent",
              color: "#087443",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View nearby parking
          </button>
        </div>
      )}

      {!homeMode && extra}

      {showCount && (
        <p className="count">
          {list.length} {list.length === 1 ? "spot" : "spots"} found
        </p>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <p>No spots match. Try another location or loosen the filters.</p>
        </div>
      ) : (
        <div className="spots">
          {list.map((spot) => (
            <SpotCard key={spot.id} spot={spot} showTags={showTags} />
          ))}
        </div>
      )}
    </section>
  );
}
