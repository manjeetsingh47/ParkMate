
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../Hero.jsx";
import { SpotArt } from "../Art.jsx";
import { BOOKINGS, SPOTS, inr } from "../data.js";

const STORAGE_KEY = "parkmate_customer_bookings";

const TABS = [
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const EXTENSION_OPTIONS = [
  { value: "30", label: "30 Minutes" },
  { value: "60", label: "1 Hour" },
  { value: "120", label: "2 Hours" },
];

function loadBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const savedBookings = Array.isArray(saved) ? saved : [];
    const savedIds = new Set(savedBookings.map((booking) => booking.id));

    return [
      ...savedBookings,
      ...BOOKINGS.filter((booking) => !savedIds.has(booking.id)),
    ];
  } catch {
    return BOOKINGS;
  }
}

export default function MyBookings() {
  const [tab, setTab] = useState("active");
  const [bookings, setBookings] = useState(loadBookings);
  const [confirmId, setConfirmId] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);
  const [extensionDuration, setExtensionDuration] = useState("30");

  const list = bookings.filter((b) => b.status === tab);

  function cancel(id) {
    setBookings((all) => {
      const updated = all.map((b) =>
        b.id === id ? { ...b, status: "cancelled" } : b
      );

      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const updatedSaved = Array.isArray(saved)
          ? saved.map((b) =>
              b.id === id ? { ...b, status: "cancelled" } : b
            )
          : [];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaved));
      } catch (error) {
        console.error("Could not update saved booking:", error);
      }

      return updated;
    });

    setConfirmId(null);
  }

  function getDirections(booking) {
    const destination = booking.address || booking.location;

    if (!destination || !destination.trim()) {
      alert("Parking address is not available for this booking.");
      return;
    }

    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  }

  function openExtension(booking) {
    setExtendBooking(booking);
    setExtensionDuration("30");
  }

  function submitExtension() {
    if (!extendBooking) return;

    alert(
      `Extension request submitted for ${extendBooking.spot}.\nRequested extension: ${extensionDuration} minutes.\nFinal availability and charges will be confirmed by the parking owner.`
    );

    setExtendBooking(null);
    setExtensionDuration("30");
  }

  function downloadReceipt(booking) {
    const receiptWindow = window.open("", "_blank");

    if (!receiptWindow) {
      alert("Please allow pop-ups to download your receipt.");
      return;
    }

    const safe = (value) =>
      String(value ?? "Not available").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    const paymentMethod =
      booking.paymentMethod === "pay_at_parking"
        ? "Pay at Parking"
        : booking.paymentMethod === "online"
          ? "Online Payment"
          : booking.paymentMethod || "Not available";

    const paymentStatus =
      booking.paymentStatus ||
      (booking.paymentMethod === "pay_at_parking"
        ? "Payment Pending"
        : "Not available");

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ParkMate Receipt - ${safe(booking.id)}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              background: #f3f7fb;
              padding: 35px;
              color: #172b4d;
            }
            .receipt {
              max-width: 620px;
              margin: auto;
              background: white;
              padding: 38px;
              border-radius: 16px;
              box-shadow: 0 8px 30px rgba(20, 45, 75, .08);
            }
            .brand {
              color: #0b8a4a;
              font-size: 30px;
              font-weight: 800;
              margin-bottom: 8px;
            }
            h2 { margin-bottom: 8px; }
            .muted { color: #64748b; }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 14px 0;
              border-bottom: 1px solid #e5eaf0;
            }
            .row strong { text-align: right; }
            .total {
              font-size: 20px;
              color: #0b8a4a;
              font-weight: bold;
              border-bottom: none;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5eaf0;
              text-align: center;
              color: #64748b;
              font-size: 13px;
            }
            @media print {
              body { background: white; padding: 0; }
              .receipt { box-shadow: none; }
            }
            @media (max-width: 500px) {
              body { padding: 12px; }
              .receipt { padding: 22px; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="brand">ParkMate</div>
            <h2>Booking Receipt</h2>
            <p class="muted">Thank you for choosing ParkMate!</p>

            <div class="row">
              <span>Booking ID</span>
              <strong>${safe(booking.id)}</strong>
            </div>
            <div class="row">
              <span>Parking Location</span>
              <strong>${safe(booking.spot)}</strong>
            </div>
            <div class="row">
              <span>Address</span>
              <strong>${safe(booking.address)}</strong>
            </div>
            <div class="row">
              <span>Date</span>
              <strong>${safe(booking.date)}</strong>
            </div>
            <div class="row">
              <span>Time</span>
              <strong>${safe(booking.time)}</strong>
            </div>
            <div class="row">
              <span>Vehicle</span>
              <strong>${safe(booking.vehicle)}</strong>
            </div>
            <div class="row">
              <span>Booking Status</span>
              <strong>${safe(booking.status)}</strong>
            </div>
            <div class="row">
              <span>Payment Method</span>
              <strong>${safe(paymentMethod)}</strong>
            </div>
            <div class="row">
              <span>Payment Status</span>
              <strong>${safe(paymentStatus)}</strong>
            </div>
            <div class="row total">
              <span>Total Amount</span>
              <strong>${safe(inr(booking.amount))}</strong>
            </div>

            <div class="footer">
              <p>This receipt was generated by ParkMate.</p>
              <p>Keep this receipt for your records.</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  }

  return (
    <>
      <PageHero
        lead="My"
        accent="Bookings"
        sub="Your active, upcoming and past parking."
      />

      <div className="tabs-row" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={"tab-btn" + (tab === t.key ? " on" : "")}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="n">
              {bookings.filter((b) => b.status === t.key).length}
            </span>
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

            const paymentMethod =
              b.paymentMethod === "pay_at_parking"
                ? "Pay at Parking"
                : b.paymentMethod === "online"
                  ? "Online Payment"
                  : b.paymentMethod || "Not available";

            const paymentStatus =
              b.paymentStatus ||
              (b.paymentMethod === "pay_at_parking"
                ? "Payment Pending"
                : "Not available");

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

                    <span className={"badge b-" + b.status}>
                      {b.status}
                    </span>
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
                    <div>
                      <dt>Payment Method</dt>
                      <dd>{paymentMethod}</dd>
                    </div>
                    <div>
                      <dt>Payment Status</dt>
                      <dd>{paymentStatus}</dd>
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
                        <button
                          className="btn btn-green"
                          onClick={() => getDirections(b)}
                        >
                          Get directions
                        </button>

                        <button
                          className="btn btn-ghost"
                          onClick={() => openExtension(b)}
                        >
                          Extend time
                        </button>
                      </>
                    )}

                    {b.status === "upcoming" &&
                      (confirmId === b.id ? (
                        <>
                          <span className="muted-s">
                            Cancel this booking?
                          </span>
                          <button
                            className="btn btn-danger"
                            onClick={() => cancel(b.id)}
                          >
                            Yes, cancel
                          </button>
                          <button
                            className="btn btn-ghost"
                            onClick={() => setConfirmId(null)}
                          >
                            Keep it
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-ghost"
                          onClick={() => setConfirmId(b.id)}
                        >
                          Cancel booking
                        </button>
                      ))}

                    {b.status === "completed" && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => downloadReceipt(b)}
                      >
                        Download receipt
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {extendBooking && (
        <div
          className="modal-overlay"
          onClick={() => setExtendBooking(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 25, 45, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            className="panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "440px",
              padding: "28px",
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            }}
          >
            <div className="row-between">
              <h2 style={{ margin: 0, color: "#102b4e" }}>
                Extend Parking Time
              </h2>
              <button
                className="btn btn-ghost"
                onClick={() => setExtendBooking(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="muted-s" style={{ marginTop: "12px" }}>
              {extendBooking.spot}
            </p>

            <p style={{ color: "#334155", fontWeight: 600 }}>
              Select additional parking time
            </p>

            <div
              style={{
                display: "grid",
                gap: "10px",
                margin: "18px 0",
              }}
            >
              {EXTENSION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    border: `1px solid ${
                      extensionDuration === option.value
                        ? "#0b8a4a"
                        : "#dbe5ef"
                    }`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    background:
                      extensionDuration === option.value
                        ? "#effaf4"
                        : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="extensionDuration"
                    value={option.value}
                    checked={extensionDuration === option.value}
                    onChange={(e) => setExtensionDuration(e.target.value)}
                  />
                  <span style={{ color: "#173451", fontWeight: 600 }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            <p className="muted-s" style={{ fontSize: "13px" }}>
              Extension is subject to parking availability and owner
              confirmation. Additional charges may apply.
            </p>

            <div
              className="actions"
              style={{ marginTop: "20px", justifyContent: "flex-end" }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setExtendBooking(null)}
              >
                Close
              </button>
              <button
                className="btn btn-green"
                onClick={submitExtension}
              >
                Request extension
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
