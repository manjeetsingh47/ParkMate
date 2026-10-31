import { useMemo } from "react";
import Icon from "../Icon.jsx";
import { USER, makeSlots, inr } from "../data.js";
import { SpotArt } from "../Art.jsx";
import { Car, Barcode, GIcon, fmtDateTime } from "./BookParts.jsx";

const HOURS = [1, 2, 3, 4, 5, 6, 8, 10, 12];
const cleanPlate = (v) => v.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
const platesReady = (st) => st.slots.length > 0 && st.slots.every((id) => (st.plates[id] || "").replace(/\s/g, "").length >= 4);
const mapsUrl = (spot) =>
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(spot.name + " " + spot.area);

/* ---------- PAGE 1: spot details ---------- */
export function DetailsView({ spot, st, onBack, onReserve }) {
  const facilities = [
    { icon: "clock", label: "24/7 Access", on: spot.open24 },
    { icon: "roof", label: "Covered Parking", on: spot.covered },
    { icon: "bolt", label: "Charging Hub", on: spot.ev },
    { icon: "cctv", label: "CCTV Security", on: true },
  ];
  return (
    <div className="bk bk-d">
      <div className="bk-hero">
        <SpotArt kind={spot.art} img={spot.img} alt={spot.name} />
        <button className="bk-mapback" onClick={onBack} aria-label="Back to results"><GIcon name="back" /></button>
      </div>
      <div className="bk-sheet">
        <span className="bk-pill">{spot.free} slots available</span>
        <div className="bk-titlerow">
          <div className="bk-tt">
            <h1>{spot.name}</h1>
            <p className="bk-sub"><Icon name="pin" size={13} /> {spot.area} · {spot.km} km away</p>
            <p className="bk-sub bk-rate"><Icon name="star" size={13} /> {spot.rating} <small>({spot.reviews})</small></p>
          </div>
          <div className="bk-price"><b>{inr(spot.price)}</b><small>per hour</small></div>
        </div>
        <div className="bk-actions">
          <a className="bk-chipbtn" href={"tel:" + USER.phone.replace(/\s/g, "")}><GIcon name="chat" size={15} /> Contact owner</a>
          <a className="bk-chipbtn" href={mapsUrl(spot)} target="_blank" rel="noreferrer"><GIcon name="nav" size={15} /> Show directions</a>
        </div>
        <h2>About</h2>
        <p className="bk-about">
          {spot.covered ? "Covered" : "Open-air"} parking at {spot.area} with {spot.total} slots. Easy entry and exit, attendant on
          site{spot.open24 ? ", open round the clock" : ""}. Reserve your slot in advance and drive straight in.
        </p>
        <h2>Facilities</h2>
        <ul className="bk-fac">
          {facilities.map((f) => (
            <li key={f.label} className={f.on ? "" : "off"}>
              <GIcon name={f.icon} size={16} /> {f.label}
            </li>
          ))}
        </ul>
        <button className="bk-cta" onClick={onReserve}>Reserve a Slot</button>
      </div>
    </div>
  );
}

/* ---------- PAGE 2: pick a slot (full map, every slot visible) ---------- */
export function SlotView({ spot, st, set, onBack, onConfirm }) {
  const slots = useMemo(() => makeSlots(spot), [spot]);
  const freeNow = slots.filter((s) => !s.booked).length;
  const count = st.slots.length;
  const total = spot.price * st.hours * count;
  const toggle = (id) => set({ slots: st.slots.includes(id) ? st.slots.filter((x) => x !== id) : [...st.slots, id] });
  const setPlate = (id, v) => set({ plates: { ...st.plates, [id]: cleanPlate(v) } });
  const fillSaved = (num) => {
    const target = st.slots.find((id) => !(st.plates[id] || "").trim()) || st.slots[0];
    if (target) setPlate(target, num);
  };
  const ready = platesReady(st);
  const renderSlot = (s, pos) => (
    <button
      key={s.id}
      type="button"
      disabled={s.booked}
      className={"bk-slot " + pos + (s.booked ? " taken" : "") + (st.slots.includes(s.id) ? " picked" : "")}
      aria-label={"Slot " + s.id + (s.booked ? ", booked" : ", available")}
      aria-pressed={st.slots.includes(s.id)}
      onClick={() => toggle(s.id)}
    >
      {s.booked ? <Car /> : <span className="bk-sid">{s.id}</span>}
    </button>
  );
  return (
    <div className="bk bk-s">
      <header className="bk-bar">
        <button className="bk-backbtn" onClick={onBack} aria-label="Back to details"><GIcon name="back" /></button>
        <h1>Pick Parking Slot</h1>
        <span className="bk-barsub">{spot.name}</span>
      </header>
      <div className="bk-sbody">
        <div className="bk-lotwrap">
          <div className="bk-lot" role="group" aria-label="Parking slot map">
            <div className="bk-row bk-top">{slots.slice(0, 7).map((s) => renderSlot(s, "top"))}</div>
            {slots.length > 7 && (
              <>
                <div className="bk-entry"><span>→ ENTRY</span></div>
                <div className="bk-mid">{slots.slice(7, 16).map((s) => renderSlot(s, "mid"))}</div>
              </>
            )}
            {slots.length > 16 && (
              <>
                <div className="bk-entry"><span>→ ENTRY</span></div>
                <div className="bk-row bk-bot">{slots.slice(16, 23).map((s) => renderSlot(s, "bot"))}</div>
              </>
            )}
          </div>
          <div className="bk-legend">
            <span><i className="free" /> Free ({freeNow})</span>
            <span><i className="sel" /> Selected</span>
            <span><i className="car" /> Booked ({slots.length - freeNow})</span>
          </div>
          {spot.total > slots.length && <p className="bk-note">Showing {slots.length} of {spot.total} slots.</p>}
        </div>

        <div className="bk-book">
          <div className="bk-rows">
            <div className="bk-r"><span>Slots</span><b>{count ? st.slots.join(", ") : "Tap a slot to select"}</b></div>
            <label className="bk-r" htmlFor="bk-arr">
              <span>Arrival Date &amp; Time</span>
              <input id="bk-arr" type="datetime-local" value={st.arrival} onChange={(e) => e.target.value && set({ arrival: e.target.value })} />
            </label>
            <label className="bk-r" htmlFor="bk-hrs">
              <span>Hours</span>
              <select id="bk-hrs" value={st.hours} onChange={(e) => set({ hours: Number(e.target.value) })}>
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>
            {count > 0 && (
              <div className="bk-cars">
                <h3>Car number{count > 1 ? "s" : ""}</h3>
                {st.slots.map((id) => (
                  <label className="bk-carin" key={id}>
                    <b>{id}</b>
                    <input type="text" autoComplete="off" placeholder="MH 12 AB 1234" value={st.plates[id] || ""} onChange={(e) => setPlate(id, e.target.value)} aria-label={"Car number for slot " + id} />
                  </label>
                ))}
                {USER.vehicles.length > 0 && (
                  <div className="bk-saved">
                    <span>Saved:</span>
                    {USER.vehicles.map((v) => (
                      <button type="button" key={v.id} onClick={() => fillSaved(v.number)}>{v.number}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="bk-r bk-total">
              <span>Total{count > 0 && <small> {count} slot{count > 1 ? "s" : ""} × {st.hours} hr × {inr(spot.price)}</small>}</span>
              <b>{inr(total)}</b>
            </div>
          </div>
          <div className="bk-ctawrap">
            <button className="bk-cta" disabled={!ready} onClick={onConfirm}>
              {!count ? "Select a slot to continue" : !ready ? "Enter car number for each slot" : `Confirm & Pay ${inr(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGE 3: ticket ---------- */
export function TicketView({ spot, st, onBack, onCancel, onBookings }) {
  const total = spot.price * st.hours * st.slots.length;
  return (
    <div className="bk bk-t">
      <header className="bk-bar light">
        <button className="bk-backbtn" onClick={onBack} aria-label="Back to slots"><GIcon name="back" /></button>
        <h1>Ticket</h1>
      </header>
      <div className="bk-ticket">
        <div className="bk-t-top">
          <h2>{spot.name}</h2>
          <p><Icon name="pin" size={13} /> {spot.area}</p>
        </div>
        <dl className="bk-t-info">
          <div><dt>Vehicle{st.slots.length > 1 ? "s" : ""}</dt><dd>{st.slots.map((id) => (<span className="bk-t-car" key={id}>{id} · {st.plates[id]}</span>))}</dd></div>
          <div><dt>Date and Time</dt><dd>{fmtDateTime(new Date(st.arrival))}</dd></div>
          <div><dt>Duration</dt><dd>{st.hours} hour{st.hours > 1 ? "s" : ""} · {inr(total)} paid</dd></div>
        </dl>
        <div className="bk-slotbar">{st.slots.length > 1 ? "Slots " : "Slot "}{st.slots.join(", ")}</div>
        <div className="bk-cut"><i /><i /></div>
        <div className="bk-t-code">
          <Barcode value={st.code} />
          <span>{st.code}</span>
        </div>
      </div>
      <div className="bk-tbtns">
        <a className="bk-white" href={mapsUrl(spot)} target="_blank" rel="noreferrer">Navigate Me</a>
        <button className="bk-white" onClick={onBookings}>View my bookings</button>
        <button className="bk-link" onClick={onCancel}>Cancel Booking</button>
      </div>
    </div>
  );
}
