
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../Icon.jsx";
import { PageHero } from "../Hero.jsx";
import SpotsPanel from "../SpotsPanel.jsx";
import { SPOTS, inr } from "../data.js";
import { useDashboardLocation } from "../DashboardLayout.jsx";

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FindParking() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const {
    selectedLocation,
    clearLocation,
  } = useDashboardLocation();

  const [covered, setCovered] = useState(false);
  const [ev, setEv] = useState(false);
  const [open24, setOpen24] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60);
  const [maxDistance, setMaxDistance] = useState(5);

  const hasLocation =
    selectedLocation &&
    Number.isFinite(Number(selectedLocation.lat)) &&
    Number.isFinite(Number(selectedLocation.lng));

  const spots = useMemo(() => {
    return SPOTS.map((spot) => {
      const lat = Number(spot.lat ?? spot.latitude);
      const lng = Number(spot.lng ?? spot.longitude);

      const hasCoordinates =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        (spot.lat != null || spot.latitude != null) &&
        (spot.lng != null || spot.longitude != null);

      const distanceKm =
        hasLocation && hasCoordinates
          ? getDistance(
              Number(selectedLocation.lat),
              Number(selectedLocation.lng),
              lat,
              lng
            )
          : null;

      return {
        ...spot,
        distanceKm,
      };
    })
      .filter((spot) => {
        const text = (
          spot.name +
          " " +
          spot.area
        ).toLowerCase();

        const matchesSearch = text.includes(q.trim().toLowerCase());
        const matchesCovered = !covered || spot.covered;
        const matchesEV = !ev || spot.ev;
        const matchesOpen = !open24 || spot.open24;
        const matchesPrice = spot.price <= maxPrice;

        const matchesDistance =
          !hasLocation ||
          (
            spot.distanceKm !== null &&
            spot.distanceKm <= maxDistance
          );

        return (
          matchesSearch &&
          matchesCovered &&
          matchesEV &&
          matchesOpen &&
          matchesPrice &&
          matchesDistance
        );
      })
      .sort((a, b) => {
        if (!hasLocation) return 0;
        return a.distanceKm - b.distanceKm;
      });
  }, [
    q,
    covered,
    ev,
    open24,
    maxPrice,
    maxDistance,
    hasLocation,
    selectedLocation,
  ]);

  const filters = (
    <div className="filters">
      {q && (
        <button
          className="chip on"
          onClick={() => setParams({})}
          aria-label={"Clear search " + q}
        >
          “{q}” <Icon name="close" size={14} stroke={2.4} />
        </button>
      )}

      <label className={"chip" + (covered ? " on" : "")}>
        <input
          type="checkbox"
          checked={covered}
          onChange={(e) => setCovered(e.target.checked)}
        />
        Covered
      </label>

      <label className={"chip" + (ev ? " on" : "")}>
        <input
          type="checkbox"
          checked={ev}
          onChange={(e) => setEv(e.target.checked)}
        />
        EV charging
      </label>

      <label className={"chip" + (open24 ? " on" : "")}>
        <input
          type="checkbox"
          checked={open24}
          onChange={(e) => setOpen24(e.target.checked)}
        />
        24x7
      </label>

      <label className="range" htmlFor="fp">
        <span>
          Max price <b>{inr(maxPrice)}/hr</b>
        </span>

        <input
          id="fp"
          type="range"
          min="10"
          max="60"
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </label>
    </div>
  );

  return (
    <>
      <PageHero
        lead="Find"
        accent="Parking"
        sub="Search, filter and book a spot near your selected location."
      />

      {hasLocation && (
        <section
          className="panel"
          style={{
            marginBottom: "20px",
            padding: "18px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 6px",
                  color: "#102b4e",
                }}
              >
                <Icon
                  name="map-pin"
                  size={18}
                  color="#0b8a4a"
                />{" "}
                Parking around your location
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                {selectedLocation.name}
                {selectedLocation.city
                  ? `, ${selectedLocation.city}`
                  : ""}
                {selectedLocation.state
                  ? `, ${selectedLocation.state}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={clearLocation}
            >
              <Icon name="close" size={16} />
              Clear location
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <label
              htmlFor="distance-filter"
              style={{
                color: "#334155",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Search within:
            </label>

            <select
              id="distance-filter"
              value={maxDistance}
              onChange={(e) =>
                setMaxDistance(Number(e.target.value))
              }
              style={{
                padding: "9px 12px",
                border: "1px solid #dce5ef",
                borderRadius: "8px",
                color: "#173451",
                background: "#f5f9fd",
              }}
            >
              <option value={1}>1 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>
        </section>
      )}

      {hasLocation && spots.length === 0 && (
        <div
          className="panel empty"
          style={{ marginBottom: "20px" }}
        >
          <p>
            No parking spots found within {maxDistance} km.
          </p>

          <p className="muted-s">
            Try increasing the distance or removing some filters.
          </p>
        </div>
      )}

      {hasLocation && spots.length > 0 && (
        <p
          style={{
            color: "#0b8a4a",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {spots.length} nearby parking spot(s) found, sorted by distance.
        </p>
      )}

      <SpotsPanel
        spots={spots}
        showTags
        showCount
        extra={filters}
      />
    </>
  );
}
