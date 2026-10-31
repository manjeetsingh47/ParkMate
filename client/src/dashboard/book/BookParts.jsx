import { useMemo } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}
function nextHour() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d;
}
export function toInput(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDateTime(d) {
  const h = d.getHours();
  return `${pad(d.getDate())} ${MON[d.getMonth()]} ${d.getFullYear()} · ${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? "AM" : "PM"}`;
}

/* Fresh booking state: lives in the /customer/book/:id layout route while the 3 pages are open. */
export function freshBooking() {
  return {
    slots: [], // picked slot ids, e.g. ["P03", "P04"]
    plates: {}, // car number typed for each picked slot, e.g. { P03: "MH 12 AB 1234" }
    hours: 2,
    arrival: toInput(nextHour()),
    code: String(Math.floor(100000 + Math.random() * 900000)),
  };
}

/* Top view of a car, drawn pointing down */
export function Car() {
  return (
    <svg className="bk-car" viewBox="0 0 24 44" aria-hidden="true">
      <rect x="2" y="2" width="20" height="40" rx="8" fill="currentColor" />
      <rect x="5" y="9" width="14" height="7" rx="2" fill="#fff" opacity=".85" />
      <rect x="5" y="27" width="14" height="6" rx="2" fill="#fff" opacity=".55" />
    </svg>
  );
}

/* Decorative street map */
export function MiniMap() {
  return (
    <svg className="bk-map" viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="640" height="260" fill="#eef0ee" />
      <g stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M-10 70 L650 120" />
        <path d="M120 -10 L170 270" />
        <path d="M400 -10 L350 270" />
        <path d="M-10 210 L650 185" />
      </g>
      <g stroke="#dfe3df" strokeWidth="3" fill="none">
        <path d="M-10 150 L650 40" />
        <path d="M510 -10 L560 270" />
      </g>
      <rect x="430" y="140" width="84" height="50" rx="6" fill="#d9ead9" />
      {[[205, 100], [390, 180], [300, 62]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="17" fill="#16a34a" />
          <text textAnchor="middle" y="6" fontSize="17" fontWeight="700" fill="#fff">P</text>
        </g>
      ))}
    </svg>
  );
}

export function Barcode({ value }) {
  const bars = useMemo(() => {
    let seed = 0;
    for (const c of value) seed = (seed * 31 + c.charCodeAt(0)) % 100003;
    const out = [];
    let x = 0;
    let bar = true; // alternate bar / gap
    while (x < 236) {
      seed = (seed * 9301 + 49297) % 233280;
      const w = 1 + Math.floor((seed / 233280) * 4);
      if (bar) out.push({ x, w });
      bar = !bar;
      x += w + 1;
    }
    return out;
  }, [value]);
  return (
    <svg className="bk-barcode" viewBox="0 0 240 64" role="img" aria-label={"Entry code " + value}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="64" fill="#0a1736" />
      ))}
    </svg>
  );
}

const STEP_NAMES = ["Spot details", "Pick a slot", "Ticket"];
export function Steps({ current }) {
  return (
    <ol className="bk-steps" aria-label="Booking steps">
      {STEP_NAMES.map((n, i) => (
        <li key={n} className={i < current ? "done" : i === current ? "now" : ""} aria-current={i === current ? "step" : undefined}>
          <b>{i < current ? "✓" : i + 1}</b>
          <span>{n}</span>
        </li>
      ))}
    </ol>
  );
}

const FAC = {
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  roof: "M3 11l9-7 9 7M5 10v10h14V10M9 20v-6h6v6",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  cctv: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6zM9 12l2 2 4-4",
  chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
  nav: "M4 11l17-7-7 17-2.5-7.5z",
  back: "M15 5l-7 7 7 7",
};
export function GIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={FAC[name]} />
    </svg>
  );
}
