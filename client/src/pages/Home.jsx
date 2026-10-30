
import { Fragment } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import "./Home.css";

/* ==========================================
   WORD-BY-WORD HEADING
========================================== */

function Words({ text, start = 0, className = "" }) {
  return text.split(" ").map((word, index) => (
    <Fragment key={`${start}-${index}`}>
      <span
        className={`word ${className}`}
        style={{ "--i": start + index }}
      >
        {word}
      </span>{" "}
    </Fragment>
  ));
}

/* ==========================================
   3D MOUSE TILT
========================================== */

function onTilt(e) {
  const rect = e.currentTarget.getBoundingClientRect();

  const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
  const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

  e.currentTarget.style.setProperty("--mx", mouseX.toFixed(3));
  e.currentTarget.style.setProperty("--my", mouseY.toFixed(3));
}

function onLeave(e) {
  e.currentTarget.style.setProperty("--mx", 0);
  e.currentTarget.style.setProperty("--my", 0);
}

/* ==========================================
   PARKING MATE CONTENT
========================================== */

const features = [
  [
    "◷",
    "Real-time availability",
    "See available spaces near your destination and avoid driving to a full parking lot."
  ],
  [
    "▣",
    "Book in advance",
    "Reserve your parking space for an hour, a day or a month."
  ],
  [
    "≡",
    "Clear, upfront pricing",
    "See the full price before booking. No hidden fees or surprises."
  ],
  [
    "▤",
    "Easy payments",
    "Enjoy a convenient payment experience and digital booking details."
  ],
  [
    "◇",
    "Safe and verified spaces",
    "Find parking options with useful information about access and security."
  ],
  [
    "➤",
    "Easy navigation",
    "Get directions to your selected parking location."
  ]
];

const steps = [
  [
    "01",
    "Search",
    "Enter where you are going and when you will arrive."
  ],
  [
    "02",
    "Book",
    "Choose a suitable spot and confirm your booking."
  ],
  [
    "03",
    "Park",
    "Follow the directions, show your booking and park."
  ]
];

const faqs = [
  [
    "How do I book a parking spot?",
    "Search for your destination, choose a parking space and follow the booking process."
  ],
  [
    "Can I cancel my booking?",
    "Cancellation options and refund rules should be checked on the booking details."
  ],
  [
    "What if the spot is not available when I arrive?",
    "Contact the Parking Mate support team for assistance."
  ],
  [
    "How and when do owners get paid?",
    "Payment details and payout schedules can be provided in the owner account."
  ],
  [
    "Is my payment information safe?",
    "Use the secure payment options provided by the platform."
  ]
];

/* ==========================================
   HOME PAGE
========================================== */

export default function Home() {
  useReveal();

  return (
    <main className="home">

      {/* HERO SECTION */}

      <section className="hero">
        <div className="wrap hero-grid">

          <div className="hero-content">

            <span className="hero-badge">
              PARKING MADE SIMPLE
            </span>

            <h1 className="hero-title">
              <Words text="Find parking in seconds." />
              <Words
                text="Park without the stress."
                start={4}
                className="accent"
              />
            </h1>

            <p>
              Parking Mate helps you find, book and pay for a
              parking spot before you leave home. No circling
              the block, no last-minute panic.
            </p>

            <div className="hero-search">
              <div>
                <small>WHERE</small>
                <span>Where do you need parking?</span>
              </div>

              <Link
                to="/login/customer"
                className="btn btn-primary"
              >
                Find Parking →
              </Link>
            </div>

            <div className="hero-trust">
              <span>✓ Verified spaces</span>
              <span>✓ Secure payments</span>
              <span>✓ Easy booking</span>
            </div>

          </div>

          {/* HERO IMAGE WITH 3D TILT */}

          <div
            className="hero-img-box"
            onMouseMove={onTilt}
            onMouseLeave={onLeave}
          >

            <div className="hero-frame">

              <div className="hero-zoom">
                <img
                  src="/images/hero-car-bay.jpg"
                  alt="Car parked in a modern parking garage"
                  className="hero-img"
                />
              </div>

            </div>

            {/* RESERVED CARD */}

            <div className="reservation-card">
              <span className="reservation-check">✓</span>

              <div>
                <strong>Spot reserved</strong>
                <small>Your parking journey starts here</small>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ABOUT */}

      <section className="section about-section reveal" id="about">
        <div className="wrap about-grid">

          <div className="about-image">
            <img
              src="/images/carpark-night.jpg"
              alt="Modern parking facility"
            />
          </div>

          <div className="about-content">
            <span className="section-label">ABOUT US</span>

            <h2 className="h2">
              Parking should be the
              <span className="accent">
                {" "}easiest part of your journey.
              </span>
            </h2>

            <p>
              Every day, drivers lose time and patience looking
              for a place to park. At the same time, many
              driveways, garages and parking lots sit empty.
            </p>

            <p>
              Parking Mate connects drivers with parking space
              owners. Drivers can discover parking options, while
              owners can list spaces they want to make available.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="section band reveal" id="features">
        <div className="wrap">

          <span className="section-label">OUR FEATURES</span>

          <h2 className="h2">
            Everything you need to park
            <span className="accent">
              {" "}with confidence.
            </span>
          </h2>

          <div className="features-grid">
            {features.map(([icon, title, text], index) => (
              <article
                className="feature-card"
                key={title}
                style={{ "--i": index }}
              >
                <div className="feature-icon">
                  {icon}
                </div>

                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* SAFETY */}

      <section className="section reveal">
        <div className="wrap safety-grid">

          <div className="safety-content">
            <span className="section-label">
              SAFE AND VERIFIED
            </span>

            <h2 className="h2">
              Spaces your car will be glad to
              <span className="accent"> stay in.</span>
            </h2>

            <p>
              Find parking options with useful information
              about access, lighting and security.
            </p>

            <ul className="gold-list">
              <li>Covered and well-lit parking options</li>
              <li>Parking information and reviews</li>
              <li>Support when you need assistance</li>
            </ul>
          </div>

          <div className="safety-image">
            <img
              src="/images/garage-headlights.jpg"
              alt="Car inside a parking garage"
            />
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="section band reveal" id="how-it-works">
        <div className="wrap">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2 className="h2">
            Park in three simple steps.
          </h2>

          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <article className="step-card" key={number}>
                <div className="step-number">
                  {number}
                </div>

                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* DRIVERS AND OWNERS */}

      <section className="section reveal" id="owners">
        <div className="wrap">

          <div className="split-grid">

            <article className="split-card">
              <span className="section-label">
                FOR DRIVERS
              </span>

              <h2>Save time on every trip.</h2>

              <ul>
                <li>Skip the search and find parking options</li>
                <li>Explore parking near your destination</li>
                <li>Choose hourly, daily or monthly plans</li>
                <li>Manage your bookings easily</li>
              </ul>

              <Link
                to="/login/customer"
                className="btn btn-primary"
              >
                Find Parking Now →
              </Link>
            </article>

            <article className="split-card owner-card">
              <span className="section-label">
                FOR SPACE OWNERS
              </span>

              <h2>
                Turn your empty space into steady income.
              </h2>

              <ul>
                <li>List your available parking space</li>
                <li>Choose your price and availability</li>
                <li>Manage your parking listings</li>
                <li>Connect with drivers</li>
              </ul>

              <Link
                to="/login/host"
                className="btn btn-secondary"
              >
                List Your Space →
              </Link>
            </article>

          </div>

        </div>
      </section>

      {/* WHY PARKING MATE */}

      <section className="section band reveal">
        <div className="wrap why-grid">

          <div>
            <h3>Time-saving</h3>
            <p>
              Spend your time on your day, not on searching for parking.
            </p>
          </div>

          <div>
            <h3>Trusted</h3>
            <p>
              Find useful parking information before making a booking.
            </p>
          </div>

          <div>
            <h3>Fair</h3>
            <p>
              Explore clear parking options and prices.
            </p>
          </div>

          <div>
            <h3>Supportive</h3>
            <p>
              Get assistance when you need help with your booking.
            </p>
          </div>

        </div>
      </section>

      {/* PRICING */}

      <section className="section reveal" id="pricing">
        <div className="wrap pricing-section">

          <span className="section-label">PRICING</span>

          <h2 className="h2">
            Simple and fair.
          </h2>

          <div className="pricing-grid">

            <article className="price-card">
              <h3>For drivers</h3>

              <div className="price">
                Flexible
              </div>

              <p>
                Booking is easy. You pay according to the
                parking space and duration you select.
              </p>

              <Link
                to="/login/customer"
                className="btn btn-primary"
              >
                Find Parking
              </Link>
            </article>

            <article className="price-card highlighted">
              <h3>For space owners</h3>

              <div className="price">
                Free to list
              </div>

              <p>
                Explore the owner registration process and
                applicable service charges.
              </p>

              <Link
                to="/login/host"
                className="btn btn-secondary"
              >
                Become a Host
              </Link>
            </article>

          </div>

        </div>
      </section>

      {/* OUR MISSION AND VISION */}

      <section className="section band reveal">
        <div className="wrap reviews-grid">

          <article className="review-card">
            <span className="quote-mark">“</span>

            <p>
              Parking Mate aims to make finding parking
              simpler and more convenient.
            </p>

            <h4>Parking Mate</h4>
            <span className="muted">Our vision</span>
          </article>

          <article className="review-card">
            <span className="quote-mark">“</span>

            <p>
              Bringing drivers and parking space owners
              together in one place.
            </p>

            <h4>Parking Mate</h4>
            <span className="muted">Our mission</span>
          </article>

        </div>
      </section>

      {/* FAQ */}

      <section className="section reveal" id="faq">
        <div className="wrap faq-section">

          <span className="section-label">
            NEED HELP?
          </span>

          <h2 className="h2">
            Frequently asked questions.
          </h2>

          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA */}

      <section className="cta reveal">
        <div className="wrap cta-content">

          <h2>
            Stop searching.
            <span className="accent"> Start parking.</span>
          </h2>

          <p>
            Join Parking Mate and discover a simpler way
            to find and manage parking.
          </p>

          <div className="cta-actions">
            <Link
              to="/login/customer"
              className="btn btn-primary"
            >
              Find Parking Now
            </Link>

            <Link
              to="/login/host"
              className="btn btn-secondary"
            >
              Become a Host
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
