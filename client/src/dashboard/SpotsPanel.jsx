import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import { SpotArt } from "./Art.jsx";
import { SPOTS, inr } from "./data.js";

export function SpotCard({ spot, showTags = false }) {
  const navigate = useNavigate();
  const low = spot.free <= 3;
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
          <Icon name="pin" size={15} filled stroke={0} /> {spot.area} <i>•</i> {spot.km} km away
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
          <button className="btn btn-green" onClick={() => navigate("/customer/book/" + spot.id)}>
            <Icon name="calcheck" size={17} /> Book
          </button>
        </div>
      </div>
    </article>
  );
}

const SORTS = { distance: "Distance", price: "Price", rating: "Rating" };

/* The white panel from the design: location picker, sort picker and the parking cards.
   `spots` can be pre-filtered by the page (e.g. Find Parking adds price / covered filters). */
export default function SpotsPanel({ spots = SPOTS, showTags = false, showCount = false, extra = null }) {
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("distance");

  const areas = useMemo(() => [...new Set(SPOTS.map((s) => s.area))], []);

  const list = useMemo(() => {
    const l = spots.filter((s) => !area || s.area === area);
    return [...l].sort((a, b) => (sort === "price" ? a.price - b.price : sort === "rating" ? b.rating - a.rating : a.km - b.km));
  }, [spots, area, sort]);

  return (
    <section className="bigpanel">
      <div className="toolbar">
        <label className="pick pick-loc">
          <span className="pick-ico">
            <Icon name="pin" size={20} filled stroke={0} />
          </span>
          <span className="pick-txt">
            <small>Your Location</small>
            <b>{area || "Select Location"}</b>
          </span>
          <Icon name="caret" size={16} stroke={2.6} />
          <select aria-label="Your location" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Select Location</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="pick pick-sort">
          <Icon name="filter" size={19} stroke={2.2} />
          <span className="pick-sorttxt">
            Sort by: <b>{SORTS[sort]}</b>
          </span>
          <Icon name="caret" size={15} stroke={2.6} />
          <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      {extra}
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
          {list.map((s) => (
            <SpotCard key={s.id} spot={s} showTags={showTags} />
          ))}
        </div>
      )}
    </section>
  );
}
