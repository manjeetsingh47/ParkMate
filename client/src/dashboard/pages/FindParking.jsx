import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../Icon.jsx";
import { PageHero } from "../Hero.jsx";
import SpotsPanel from "../SpotsPanel.jsx";
import { SPOTS, inr } from "../data.js";

export default function FindParking() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || ""; // set from the search box in the top bar
  const [covered, setCovered] = useState(false);
  const [ev, setEv] = useState(false);
  const [open24, setOpen24] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60);

  const spots = SPOTS.filter((s) => {
    const text = (s.name + " " + s.area).toLowerCase();
    return text.includes(q.trim().toLowerCase()) && (!covered || s.covered) && (!ev || s.ev) && (!open24 || s.open24) && s.price <= maxPrice;
  });

  const filters = (
    <div className="filters">
      {q && (
        <button className="chip on" onClick={() => setParams({})} aria-label={"Clear search " + q}>
          “{q}” <Icon name="close" size={14} stroke={2.4} />
        </button>
      )}
      <label className={"chip" + (covered ? " on" : "")}>
        <input type="checkbox" checked={covered} onChange={(e) => setCovered(e.target.checked)} /> Covered
      </label>
      <label className={"chip" + (ev ? " on" : "")}>
        <input type="checkbox" checked={ev} onChange={(e) => setEv(e.target.checked)} /> EV charging
      </label>
      <label className={"chip" + (open24 ? " on" : "")}>
        <input type="checkbox" checked={open24} onChange={(e) => setOpen24(e.target.checked)} /> 24x7
      </label>
      <label className="range" htmlFor="fp">
        <span>Max price <b>{inr(maxPrice)}/hr</b></span>
        <input id="fp" type="range" min="10" max="60" step="5" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
      </label>
    </div>
  );

  return (
    <>
      <PageHero lead="Find" accent="Parking" sub="Search, filter and book a spot near you." />
      <SpotsPanel spots={spots} showTags showCount extra={filters} />
    </>
  );
}
