/* ParkMate logo (pin with a P) + the small city-and-car picture at the bottom of the sidebar.
   Drawn inline so the dashboard does not depend on any image files. */
export function ParkLogo({ size = 54, text = true }) {
  return (
    <span className="pl">
      <svg width={size} height={size * 1.1} viewBox="0 0 56 62" aria-hidden="true">
        <defs>
          <linearGradient id="pl-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1fd1a0" />
            <stop offset="1" stopColor="#12a35b" />
          </linearGradient>
        </defs>
        <path d="M28 3C15 3 5 12.6 5 24.6 5 38.5 22 52 28 59c6-7 23-20.5 23-34.4C51 12.6 41 3 28 3z" fill="url(#pl-g)" />
        <circle cx="28" cy="24" r="14.5" fill="#0a1736" />
        <path d="M22.5 33V15.5h7.2a5.7 5.7 0 0 1 0 11.4h-3.6" fill="none" stroke="#2ee07f" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text && (
        <b className="pl-text">
          Park<span>Mate</span>
        </b>
      )}
    </span>
  );
}

export function SideArt() {
  return (
    <svg className="side-art" viewBox="0 0 180 130" aria-hidden="true">
      <defs>
        <linearGradient id="sa-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a5fc4" />
          <stop offset="1" stopColor="#16296b" />
        </linearGradient>
        <radialGradient id="sa-glow" cx="50%" cy="85%" r="60%">
          <stop offset="0" stopColor="#3c6bff" stopOpacity=".45" />
          <stop offset="1" stopColor="#3c6bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="180" height="130" fill="url(#sa-glow)" />
      <g fill="url(#sa-b)" opacity=".95">
        <rect x="24" y="52" width="16" height="48" />
        <rect x="42" y="30" width="20" height="70" />
        <rect x="66" y="12" width="22" height="88" />
        <rect x="92" y="38" width="18" height="62" />
        <rect x="114" y="24" width="22" height="76" />
        <rect x="140" y="56" width="16" height="44" />
        <path d="M74 12l3-9 3 9z" />
      </g>
      <g fill="#8fb1ff" opacity=".55">
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x="46" y={38 + r * 11} width="4" height="5" />
            <rect x="54" y={38 + r * 11} width="4" height="5" />
            <rect x="71" y={22 + r * 12} width="4" height="5" />
            <rect x="79" y={22 + r * 12} width="4" height="5" />
            <rect x="119" y={32 + r * 11} width="4" height="5" />
            <rect x="127" y={32 + r * 11} width="4" height="5" />
          </g>
        ))}
      </g>
      <ellipse cx="90" cy="108" rx="78" ry="8" fill="#0a1736" opacity=".7" />
      <g transform="translate(40 80)">
        <path d="M6 24c0-5 2-8 7-10l12-8c3-2 6-3 10-3h22c6 0 10 2 14 6l8 6c6 1 9 4 9 9v4H6z" fill="#fff" />
        <path d="M30 8h14l-1 10H22zM48 8h8c3 0 5 1 7 3l5 7H47z" fill="#1c2f6e" opacity=".85" />
        <circle cx="28" cy="31" r="7.5" fill="#101a3d" />
        <circle cx="28" cy="31" r="3.2" fill="#9fb4e8" />
        <circle cx="76" cy="31" r="7.5" fill="#101a3d" />
        <circle cx="76" cy="31" r="3.2" fill="#9fb4e8" />
      </g>
    </svg>
  );
}
