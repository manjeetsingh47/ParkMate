/* Drawn pictures for parking spots and the hero banner (no image files needed).
   To use real photos later, add an `img` url to a spot in data.js - SpotArt will show it instead. */

function Win({ x, y, cols, rows, w = 10, h = 12, gx = 6, gy = 7, fill = "#a9cdf0", op = 0.9 }) {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push(<rect key={r + "-" + c} x={x + c * (w + gx)} y={y + r * (h + gy)} width={w} height={h} rx="1.5" fill={fill} opacity={op} />);
  return <g>{out}</g>;
}

function Tree({ x, y, s = 1, c = "#2f7d3e" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height="28" fill="#5a3b24" />
      <circle cx="-13" cy="6" r="14" fill={c} opacity=".92" />
      <circle cx="13" cy="6" r="14" fill={c} opacity=".92" />
      <circle cx="0" cy="-7" r="19" fill={c} />
    </g>
  );
}

const SKY = {
  mall: ["#6fb0ee", "#d8edff"],
  station: ["#78b6ee", "#e3f2ff"],
  park: ["#86c5f0", "#eaf7ff"],
  tech: ["#5fa6ea", "#cfe6fb"],
  market: ["#94c4ee", "#f6e8d2"],
  hospital: ["#78b8f0", "#e1f1ff"],
};

function Scene({ kind }) {
  switch (kind) {
    case "mall":
      return (
        <>
          <rect x="88" y="104" width="270" height="48" fill="#d8c8ac" />
          <rect x="112" y="46" width="226" height="64" fill="#25425f" />
          <rect x="112" y="46" width="226" height="64" fill="#5b8dbd" opacity=".35" />
          <Win x={120} y={54} cols={11} rows={3} w={13} h={9} gx={7} gy={5} fill="#a4c8ea" />
          <rect x="150" y="112" width="160" height="30" fill="#1d3550" />
          <Win x={156} y={118} cols={7} rows={1} w={16} h={18} gx={6} gy={0} fill="#7fb0dd" />
          <g transform="rotate(-8 190 84)">
            <text x="168" y="86" fontSize="17" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif">CITY CENTER</text>
          </g>
          <Tree x={46} y={104} s={1.15} />
          <Tree x={382} y={118} s={0.9} c="#3a8a4a" />
        </>
      );
    case "station":
      return (
        <>
          <rect x="54" y="78" width="300" height="76" fill="#e9e0d1" />
          <rect x="48" y="70" width="312" height="11" fill="#b4aa9a" />
          <Win x={64} y={92} cols={14} rows={2} w={12} h={14} gx={8} gy={10} fill="#7fa8cf" />
          <rect x="140" y="38" width="124" height="24" rx="3" fill="#fff" stroke="#c9d3e0" />
          <circle cx="156" cy="50" r="7" fill="#d62f2f" />
          <text x="170" y="56" fontSize="15" fontWeight="800" fill="#1e4fa8" fontFamily="Arial,sans-serif">STATION</text>
          <rect x="176" y="62" width="52" height="92" fill="#cfc4b2" />
          <rect x="184" y="108" width="36" height="46" fill="#37506b" />
          <Tree x={28} y={108} s={1.1} />
          <Tree x={384} y={112} s={1} c="#3a8a4a" />
        </>
      );
    case "park":
      return (
        <>
          <Tree x={30} y={80} s={2} c="#2a6f38" />
          <Tree x={96} y={96} s={1.5} c="#3a8a4a" />
          <Tree x={372} y={78} s={2.1} c="#2a6f38" />
          <Tree x={318} y={96} s={1.5} c="#3a8a4a" />
          <rect x="156" y="82" width="104" height="72" fill="#cbdcf0" />
          <rect x="156" y="82" width="104" height="9" fill="#5e7ea6" />
          <Win x={166} y={98} cols={5} rows={3} w={11} h={10} gx={7} gy={7} fill="#5b8fc7" />
          <Tree x={208} y={116} s={0.8} c="#34803f" />
        </>
      );
    case "tech":
      return (
        <>
          <rect x="52" y="52" width="92" height="102" fill="#4d6c8f" />
          <rect x="150" y="26" width="100" height="128" fill="#dce8f4" />
          <rect x="256" y="62" width="96" height="92" fill="#58779c" />
          <Win x={60} y={60} cols={5} rows={5} w={11} h={10} gx={7} gy={7} fill="#bfdcf5" />
          <Win x={158} y={34} cols={5} rows={7} w={12} h={9} gx={7} gy={6} fill="#6ea0d2" />
          <Win x={264} y={70} cols={5} rows={4} w={11} h={11} gx={7} gy={7} fill="#bfdcf5" />
          <Tree x={30} y={122} s={0.9} />
          <Tree x={378} y={124} s={0.9} c="#3a8a4a" />
        </>
      );
    case "market":
      return (
        <>
          <rect x="62" y="84" width="276" height="70" fill="#b5533d" />
          <rect x="186" y="42" width="28" height="46" fill="#c46a50" />
          <path d="M180 44a20 20 0 0 1 40 0z" fill="#efe3cf" />
          <rect x="198" y="22" width="4" height="12" fill="#efe3cf" />
          <rect x="62" y="80" width="276" height="7" fill="#e4cfae" />
          {Array.from({ length: 11 }).map((_, i) => (
            <path key={i} d={`M${72 + i * 24} 118v-14a7 7 0 0 1 14 0v14z`} fill="#7a2f22" />
          ))}
          {["#d94f4f", "#f2b632", "#3f9a5a", "#3a6fd1", "#d94f4f", "#f2b632", "#3f9a5a"].map((c, i) => (
            <rect key={i} x={74 + i * 38} y="128" width="30" height="12" rx="2" fill={c} />
          ))}
          <Tree x={32} y={104} s={1.15} c="#3a7a3a" />
          <Tree x={376} y={106} s={1.15} c="#3a7a3a" />
        </>
      );
    case "hospital":
      return (
        <>
          <rect x="86" y="58" width="240" height="96" fill="#dfeaf6" />
          <rect x="86" y="58" width="240" height="8" fill="#fff" />
          <Win x={96} y={74} cols={11} rows={3} w={15} h={11} gx={6} gy={8} fill="#4f86c2" />
          <rect x="118" y="34" width="132" height="24" rx="3" fill="#fff" stroke="#cbd6e4" />
          <rect x="124" y="38" width="6" height="16" fill="#d62f2f" />
          <rect x="119" y="43" width="16" height="6" fill="#d62f2f" />
          <text x="142" y="52" fontSize="14" fontWeight="800" fill="#1e4fa8" fontFamily="Arial,sans-serif">HOSPITAL</text>
          <rect x="188" y="124" width="36" height="30" fill="#37506b" />
          <Tree x={46} y={106} s={1.1} />
          <Tree x={376} y={110} s={1} c="#3a8a4a" />
        </>
      );
    default:
      return <rect x="120" y="60" width="160" height="94" fill="#c3d3e6" />;
  }
}

export function SpotArt({ kind = "mall", img, alt = "" }) {
  if (img) return <img className="spot-art" src={img} alt={alt} loading="lazy" />;
  const [a, b] = SKY[kind] || SKY.mall;
  return (
    <svg className="spot-art" viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <defs>
        <linearGradient id={"sky-" + kind} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="400" height="190" fill={`url(#sky-${kind})`} />
      <Scene kind={kind} />
      <rect y="152" width="400" height="38" fill="#6c7788" />
      <rect y="152" width="400" height="4" fill="#9aa5b5" />
      <path d="M0 176h400" stroke="#d9dee7" strokeWidth="2" strokeDasharray="22 16" opacity=".7" />
    </svg>
  );
}

/* Dark underground-garage picture behind the hero banner */
export function HeroArt() {
  const lights = [];
  [
    { y: 62, w: 46, n: 9, gap: 118, x0: 40 },
    { y: 88, w: 62, n: 8, gap: 138, x0: 10 },
    { y: 118, w: 84, n: 7, gap: 170, x0: -20 },
  ].forEach((row, ri) => {
    for (let i = 0; i < row.n; i++)
      lights.push(<rect key={ri + "-" + i} x={row.x0 + i * row.gap} y={row.y} width={row.w} height={4 + ri} rx="2" fill="#e9f2ff" opacity={0.55 + ri * 0.15} />);
  });
  const pillars = [
    { x: 600, w: 22, top: 70 },
    { x: 760, w: 30, top: 54 },
    { x: 940, w: 40, top: 30 },
  ];
  return (
    <svg className="dhero-art" viewBox="0 0 1200 260" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040a1a" />
          <stop offset=".55" stopColor="#0a1a3a" />
          <stop offset="1" stopColor="#0b2146" />
        </linearGradient>
        <pattern id="ha-haz" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="14" fill="#f2c230" />
          <rect x="7" width="7" height="14" fill="#10192e" />
        </pattern>
        <linearGradient id="ha-pil" x1="0" x2="1">
          <stop offset="0" stopColor="#8f9bb0" />
          <stop offset=".5" stopColor="#dfe5ee" />
          <stop offset="1" stopColor="#9aa6ba" />
        </linearGradient>
        <radialGradient id="ha-floor" cx="55%" cy="0%" r="90%">
          <stop offset="0" stopColor="#2c5aa8" stopOpacity=".55" />
          <stop offset="1" stopColor="#2c5aa8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="260" fill="url(#ha-bg)" />
      <rect y="0" width="1200" height="140" fill="#02060f" opacity=".5" />
      {lights}
      <polygon points="0,150 1200,130 1200,260 0,260" fill="#0c2146" />
      <rect y="130" width="1200" height="130" fill="url(#ha-floor)" />
      <g stroke="#f2c230" strokeWidth="2.5" opacity=".55">
        <path d="M420 150L300 260" />
        <path d="M700 148L640 260" />
        <path d="M980 146L1010 260" />
      </g>
      {/* far parked cars */}
      <g fill="#162540">
        {[430, 520, 600].map((x, i) => (
          <rect key={x} x={x} y={118 + i * 2} width="62" height="26" rx="10" />
        ))}
      </g>
      <g fill="#ff4a4a" opacity=".85">
        {[438, 502, 530, 594].map((x) => (
          <rect key={x} x={x} y="136" width="6" height="4" rx="1" />
        ))}
      </g>
      {pillars.map((p) => (
        <g key={p.x}>
          <rect x={p.x} y={p.top} width={p.w} height={210 - p.top} fill="url(#ha-pil)" />
          <rect x={p.x} y={170} width={p.w} height={40} fill="url(#ha-haz)" />
        </g>
      ))}
      <rect x="1118" y="0" width="82" height="210" fill="url(#ha-pil)" />
      <rect x="1118" y="150" width="82" height="62" fill="url(#ha-haz)" />
      <text x="1138" y="96" fontSize="34" fontWeight="800" fill="#1b2a47" fontFamily="Arial,sans-serif">P1</text>
      {/* foreground car */}
      <g transform="translate(850 112)">
        <ellipse cx="150" cy="126" rx="160" ry="12" fill="#000" opacity=".5" />
        <path d="M10 110c-2-26 6-40 28-46l50-16c22-14 50-22 84-22 36 0 58 8 78 26l34 12c20 6 28 18 28 40v12c0 8-6 12-14 12H24c-8 0-14-4-14-18z" fill="#0d1424" stroke="#3c4d6e" strokeWidth="2" />
        <path d="M96 52l30-14c24-8 52-8 76 2l30 22z" fill="#1c2c4b" opacity=".9" />
        <path d="M20 86h40l8 6H22z" fill="#d6e4ff" opacity=".9" />
        <circle cx="86" cy="118" r="22" fill="#05070d" stroke="#51638a" strokeWidth="3" />
        <circle cx="86" cy="118" r="10" fill="#8394b8" />
        <circle cx="244" cy="118" r="22" fill="#05070d" stroke="#51638a" strokeWidth="3" />
        <circle cx="244" cy="118" r="10" fill="#8394b8" />
      </g>
    </svg>
  );
}
