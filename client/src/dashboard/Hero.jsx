import { HeroArt } from "./Art.jsx";
import Icon from "./Icon.jsx";

/* Big banner on Home */
export function Hero() {
  return (
    <section className="dhero" aria-label="Find parking">
      <HeroArt />
      <div className="dhero-copy">
        <h1>
          Find <span>Parking</span>
        </h1>
        <p className="dhero-sub">Tap. Book. Park.</p>
        <i className="dhero-bar" />
      </div>
      <div className="dhero-badge">
        <Icon name="shield" size={22} filled={false} stroke={2.2} />
        Safe &amp; Secure Parking
      </div>
    </section>
  );
}

/* Slimmer version of the same banner for every other page */
export function PageHero({ lead, accent, sub }) {
  return (
    <section className="dhero dhero-slim">
      <HeroArt />
      <div className="dhero-copy">
        <h1>
          {lead} <span>{accent}</span>
        </h1>
        {sub && <p className="dhero-sub">{sub}</p>}
      </div>
    </section>
  );
}
