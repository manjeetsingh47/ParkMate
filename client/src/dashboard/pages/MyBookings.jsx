import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../Hero.jsx";
import { SpotArt } from "../Art.jsx";
import { BOOKINGS, SPOTS, inr } from "../data.js";

const TABS = [
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function MyBookings() {
  const [tab, setTab] = useState("active");
  const [bookings, setBookings] = useState(BOOKINGS);
  const [confirmId, setConfirmId] = useState(null);

  const list = bookings.filter((b) => b.status === tab);

  function cancel(id) {
    setBookings((all) => all.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    setConfirmId(null);
  }

  return (
    <>
      <PageHero lead="My" accent="Bookings" sub="Your active, upcoming and past parking." />

      <div className="tabs-row" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={"tab-btn" + (tab === t.key ? " on" : "")}
            onClick={() => setTab(t.key)}
          >
            {t.label} <span className="n">{bookings.filter((b) => b.status === t.key).length}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="panel empty">
          <p>No {tab} bookings.</p>
          {tab !== "cancelled" && (
            <Link to="/customer/find" className="btn btn-green">
              Find parking
            </Link>
          )}
        </div>
      ) : (
        <div className="bcard-list">
          {list.map((b) => {
            const spot = SPOTS.find((s) => s.name === b.spot);
            return (
            <article className="bcard" key={b.id}>
              <div className="bcard-img">
                <SpotArt kind={spot?.art} img={spot?.img} />
              </div>
              <div className="bcard-main">
              <div className="row-between">
                <div>
                  <div className="strong">{b.spot}</div>
                  <div className="muted-s">
                    {b.address} · Booking {b.id}
                  </div>
                </div>
                <span className={"badge b-" + b.status}>{b.status}</span>
              </div>
              <dl className="kv">
                <div>
                  <dt>Date</dt>
                  <dd>{b.date}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{b.time}</dd>
                </div>
                <div>
                  <dt>Vehicle</dt>
                  <dd>{b.vehicle}</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>{inr(b.amount)}</dd>
                </div>
                {(b.status === "active" || b.status === "upcoming") && (
                  <div>
                    <dt>Entry code</dt>
                    <dd className="code">{b.code}</dd>
                  </div>
                )}
              </dl>
              <div className="actions">
                {b.status === "active" && (
                  <>
                    <button className="btn btn-green">Get directions</button>
                    <button className="btn btn-ghost">Extend time</button>
                  </>
                )}
                {b.status === "upcoming" &&
                  (confirmId === b.id ? (
                    <>
                      <span className="muted-s">Cancel this booking?</span>
                      <button className="btn btn-danger" onClick={() => cancel(b.id)}>
                        Yes, cancel
                      </button>
                      <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>
                        Keep it
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-ghost" onClick={() => setConfirmId(b.id)}>
                      Cancel booking
                    </button>
                  ))}
                {b.status === "completed" && <button className="btn btn-ghost">Download receipt</button>}
              </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </>
  );
}
