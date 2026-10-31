import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { Hero } from "../Hero.jsx";
import SpotsPanel from "../SpotsPanel.jsx";
import { SpotArt } from "../Art.jsx";
import { USER, BOOKINGS, SPOTS, inr } from "../data.js";

export default function Home() {
  const active = BOOKINGS.find((b) => b.status === "active");
  const upcoming = BOOKINGS.filter((b) => b.status === "upcoming");
  const completed = BOOKINGS.filter((b) => b.status === "completed");
  const spent = BOOKINGS.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0);
  const activeSpot = active && SPOTS.find((s) => s.name === active.spot);

  return (
    <>
      <Hero />
      <SpotsPanel />

      <div className="stats">
        <div className="stat">
          <span className="stat-ico"><Icon name="calendar" size={20} /></span>
          <div><span>Upcoming bookings</span><b>{upcoming.length}</b></div>
        </div>
        <div className="stat">
          <span className="stat-ico"><Icon name="shield" size={20} /></span>
          <div><span>Completed</span><b>{completed.length}</b></div>
        </div>
        <div className="stat">
          <span className="stat-ico"><Icon name="wallet" size={20} /></span>
          <div><span>Total spent</span><b>{inr(spent)}</b></div>
        </div>
        <div className="stat">
          <span className="stat-ico"><Icon name="user" size={20} /></span>
          <div><span>Vehicles</span><b>{USER.vehicles.length}</b></div>
        </div>
      </div>

      <div className="two">
        <section className="panel">
          <h2>Active booking</h2>
          {active ? (
            <div className="active">
              {activeSpot && (
                <div className="active-img">
                  <SpotArt kind={activeSpot.art} img={activeSpot.img} />
                </div>
              )}
              <div className="active-top">
                <div>
                  <div className="big">{active.spot}</div>
                  <div className="muted-s">
                    <Icon name="pin" size={14} /> {active.address}
                  </div>
                </div>
                <span className="badge b-active">{active.endsIn} left</span>
              </div>
              <dl className="kv">
                <div><dt>Vehicle</dt><dd>{active.vehicle}</dd></div>
                <div><dt>Time</dt><dd>{active.time}</dd></div>
                <div><dt>Entry code</dt><dd className="code">{active.code}</dd></div>
              </dl>
              <div className="actions">
                <button className="btn btn-green">Get directions</button>
                <button className="btn btn-ghost">Extend time</button>
              </div>
            </div>
          ) : (
            <div className="empty">
              <p>No active booking right now.</p>
              <Link to="/customer/find" className="btn btn-green">Find parking</Link>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="row-between">
            <h2>Upcoming</h2>
            <Link to="/customer/bookings" className="link">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty"><p>No upcoming bookings.</p></div>
          ) : (
            <ul className="list">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <div>
                    <div className="strong">{b.spot}</div>
                    <div className="muted-s">{b.date} · {b.time}</div>
                  </div>
                  <span className="strong">{inr(b.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
