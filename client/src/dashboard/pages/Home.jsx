
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { Hero } from "../Hero.jsx";
import SpotsPanel from "../SpotsPanel.jsx";
import { SpotArt } from "../Art.jsx";
import { USER, BOOKINGS, SPOTS, inr } from "../data.js";
import { useDashboardLocation } from "../DashboardLayout.jsx";

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  const {
    selectedLocation,
    detectCurrentLocation,
    locationLoading,
    locationError,
  } = useDashboardLocation();

  const [maxDistance, setMaxDistance] = useState(5);

  const active = BOOKINGS.find((b) => b.status === "active");
  const upcoming = BOOKINGS.filter((b) => b.status === "upcoming");
  const completed = BOOKINGS.filter((b) => b.status === "completed");

  const spent = BOOKINGS.filter(
    (b) => b.status !== "cancelled"
  ).reduce((s, b) => s + b.amount, 0);

  const activeSpot =
    active && SPOTS.find((s) => s.name === active.spot);

  const hasLocation =
    selectedLocation &&
    Number.isFinite(Number(selectedLocation.lat)) &&
    Number.isFinite(Number(selectedLocation.lng));

  const nearbySpots = useMemo(() => {
    if (!hasLocation) return SPOTS;

    return SPOTS.map((spot) => {
      const lat = Number(spot.lat ?? spot.latitude);
      const lng = Number(spot.lng ?? spot.longitude);

      const hasCoordinates =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        (spot.lat != null || spot.latitude != null) &&
        (spot.lng != null || spot.longitude != null);

      const distanceKm = hasCoordinates
        ? getDistanceKm(
            Number(selectedLocation.lat),
            Number(selectedLocation.lng),
            lat,
            lng
          )
        : null;

      return { ...spot, distanceKm };
    })
      .filter(
        (spot) =>
          spot.distanceKm !== null &&
          spot.distanceKm <= maxDistance
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [hasLocation, selectedLocation, maxDistance]);

  const radiusControls = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "16px",
      }}
    >
      <span
        style={{
          color: "#eff3f1",
          fontSize: "16px",
          fontWeight: 700,
        }}
      >
        Search radius:
      </span>

      {[1, 3, 5, 10].map((distance) => (
        <button
          key={distance}
          type="button"
          onClick={() => setMaxDistance(distance)}
          style={{
            padding: "7px 15px",
            border: "1px solid #b8ddc8",
            borderRadius: "9px",
            background:
              maxDistance === distance ? "#0b8a4a" : "#ffffff",
            color:
              maxDistance === distance ? "#ffffff" : "#276449",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {distance} km
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Hero />

      <SpotsPanel
        spots={nearbySpots}
        showTags
        showCount
        homeMode
        extra={
          <>
            {radiusControls}

            {hasLocation && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px 14px",
                  background: "#eaf7f0",
                  borderRadius: "10px",
                  color: "#087443",
                  fontSize: "13px",
                }}
              >
                <Icon name="check-circle" size={16} />{" "}
                {nearbySpots.length > 0
                  ? `Found ${nearbySpots.length} parking spot(s) within ${maxDistance} km, sorted by distance.`
                  : `No parking spots found within ${maxDistance} km. Try increasing your search radius.`}
              </div>
            )}
          </>
        }
      />

      <div className="stats">
        <div className="stat">
          <span className="stat-ico">
            <Icon name="calendar" size={20} />
          </span>
          <div>
            <span>Upcoming bookings</span>
            <b>{upcoming.length}</b>
          </div>
        </div>

        <div className="stat">
          <span className="stat-ico">
            <Icon name="shield" size={20} />
          </span>
          <div>
            <span>Completed</span>
            <b>{completed.length}</b>
          </div>
        </div>

        <div className="stat">
          <span className="stat-ico">
            <Icon name="wallet" size={20} />
          </span>
          <div>
            <span>Total spent</span>
            <b>{inr(spent)}</b>
          </div>
        </div>

        <div className="stat">
          <span className="stat-ico">
            <Icon name="user" size={20} />
          </span>
          <div>
            <span>Vehicles</span>
            <b>{USER.vehicles.length}</b>
          </div>
        </div>
      </div>

      <div className="two">
        <section className="panel">
          <h2>Active booking</h2>

          {active ? (
            <div className="active">
              {activeSpot && (
                <div className="active-img">
                  <SpotArt
                    kind={activeSpot.art}
                    img={activeSpot.img}
                  />
                </div>
              )}

              <div className="active-top">
                <div>
                  <div className="big">{active.spot}</div>
                  <div className="muted-s">
                    <Icon name="pin" size={14} /> {active.address}
                  </div>
                </div>

                <span className="badge b-active">
                  {active.endsIn} left
                </span>
              </div>

              <dl className="kv">
                <div>
                  <dt>Vehicle</dt>
                  <dd>{active.vehicle}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{active.time}</dd>
                </div>
                <div>
                  <dt>Entry code</dt>
                  <dd className="code">{active.code}</dd>
                </div>
              </dl>

              <div className="actions">
                <Link to="/customer/bookings" className="btn btn-green">
                  View booking
                </Link>
                <Link to="/customer/bookings" className="btn btn-ghost">
                  Manage booking
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty">
              <p>No active booking right now.</p>
              <Link to="/customer/find" className="btn btn-green">
                Find parking
              </Link>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="row-between">
            <h2>Upcoming</h2>
            <Link to="/customer/bookings" className="link">
              View all
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty">
              <p>No upcoming bookings.</p>
            </div>
          ) : (
            <ul className="list">
              {upcoming.map((booking) => (
                <li key={booking.id}>
                  <div>
                    <div className="strong">{booking.spot}</div>
                    <div className="muted-s">
                      {booking.date} · {booking.time}
                    </div>
                  </div>
                  <span className="strong">
                    {inr(booking.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
