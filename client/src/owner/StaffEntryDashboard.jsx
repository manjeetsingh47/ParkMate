
import { useMemo, useState } from "react";

const initialBookings = [
  {
    id: "PM-1024",
    code: "482916",
    customer: "Aarav Sharma",
    vehicle: "UP16 AB 4521",
    type: "Car",
    slot: "A-08",
    location: "City Centre Parking",
    date: "19 Nov 2026",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    id: "PM-1025",
    code: "735219",
    customer: "Rohit Verma",
    vehicle: "UP85 CD 7890",
    type: "Bike",
    slot: "B-04",
    location: "City Centre Parking",
    date: "19 Nov 2026",
    time: "12:00 PM",
    status: "Confirmed",
  },
  {
    id: "PM-1026",
    code: "196428",
    customer: "Priya Singh",
    vehicle: "DL8C EF 1234",
    type: "Car",
    slot: "A-12",
    location: "City Centre Parking",
    date: "19 Nov 2026",
    time: "10:00 AM",
    status: "Entered",
    entryTime: "10:15 AM",
  },
];

export default function StaffEntryDashboard() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  const staff = {
    name: "Rahul Sharma",
    location: "City Centre Parking",
    duty: "Entry Gate",
    staffId: "STF-001",
  };

  const locationBookings = bookings.filter(
    (booking) => booking.location === staff.location
  );

  const filteredBookings = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return locationBookings;

    return locationBookings.filter((booking) =>
      [
        booking.id,
        booking.code,
        booking.customer,
        booking.vehicle,
        booking.slot,
      ].some((item) => item.toLowerCase().includes(value))
    );
  }, [bookings, search]);

  const enteredCount = locationBookings.filter(
    (booking) => booking.status === "Entered"
  ).length;

  const pendingCount = locationBookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const markEntry = () => {
    if (!selectedBooking) return;

    if (selectedBooking.status === "Entered") {
      setMessage("This vehicle has already entered.");
      return;
    }

    const entryTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setBookings((current) =>
      current.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: "Entered", entryTime }
          : booking
      )
    );

    setSelectedBooking({
      ...selectedBooking,
      status: "Entered",
      entryTime,
    });

    setMessage("Vehicle entry successfully recorded.");
  };

  return (
    <div className="owner-page">
      <div className="owner-page-heading">
        <div>
          <h2>Entry Gate Dashboard</h2>
          <p>Verify customer bookings and manage vehicle entries.</p>
        </div>
        <span className="owner-status active">Entry Gate Active</span>
      </div>

      <div className="owner-panel" style={{ marginBottom: 22 }}>
        <div className="owner-panel-heading">
          <h3>Staff Information</h3>
        </div>

        <div style={styles.staffGrid}>
          <div>
            <small>Staff Name</small>
            <strong>{staff.name}</strong>
          </div>
          <div>
            <small>Staff ID</small>
            <strong>{staff.staffId}</strong>
          </div>
          <div>
            <small>Assigned Location</small>
            <strong>{staff.location}</strong>
          </div>
          <div>
            <small>Duty</small>
            <strong>{staff.duty}</strong>
          </div>
        </div>
      </div>

      <div className="owner-stats">
        <div className="owner-stat-card">
          <span>Total Bookings</span>
          <h2>{locationBookings.length}</h2>
        </div>
        <div className="owner-stat-card">
          <span>Pending Entries</span>
          <h2>{pendingCount}</h2>
        </div>
        <div className="owner-stat-card">
          <span>Vehicles Entered</span>
          <h2>{enteredCount}</h2>
        </div>
      </div>

      <div className="owner-panel" style={{ marginTop: 22 }}>
        <div className="owner-panel-heading">
          <div>
            <h3>Booking Verification</h3>
            <p>Search using booking ID, entry code or vehicle number.</p>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setMessage("");
          }}
          placeholder="Enter booking ID, code or vehicle number..."
          style={styles.search}
        />

        <div style={styles.bookingList}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.bookingRow}>
              <div>
                <strong>{booking.customer}</strong>
                <p style={styles.muted}>
                  {booking.id} · {booking.vehicle}
                </p>
                <p style={styles.muted}>
                  Slot {booking.slot} · {booking.time}
                </p>
              </div>

              <div style={styles.bookingActions}>
                <span
                  className={`owner-status ${
                    booking.status === "Entered" ? "completed" : "active"
                  }`}
                >
                  {booking.status}
                </span>
                <button
                  type="button"
                  style={styles.outlineButton}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setMessage("");
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="owner-empty">
              No matching bookings found.
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div className="owner-panel-heading">
              <h3>Booking Details</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setMessage("");
                }}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.details}>
              <div><small>Booking ID</small><strong>{selectedBooking.id}</strong></div>
              <div><small>Entry Code</small><strong>{selectedBooking.code}</strong></div>
              <div><small>Customer</small><strong>{selectedBooking.customer}</strong></div>
              <div><small>Vehicle Number</small><strong>{selectedBooking.vehicle}</strong></div>
              <div><small>Vehicle Type</small><strong>{selectedBooking.type}</strong></div>
              <div><small>Parking Slot</small><strong>{selectedBooking.slot}</strong></div>
              <div><small>Booking Date</small><strong>{selectedBooking.date}</strong></div>
              <div><small>Booking Time</small><strong>{selectedBooking.time}</strong></div>
              <div><small>Status</small><strong>{selectedBooking.status}</strong></div>
              {selectedBooking.entryTime && (
                <div><small>Entry Time</small><strong>{selectedBooking.entryTime}</strong></div>
              )}
            </div>

            {message && (
              <p style={styles.message}>{message}</p>
            )}

            {selectedBooking.status === "Confirmed" ? (
              <button
                type="button"
                style={styles.primaryButton}
                onClick={markEntry}
              >
                Confirm Vehicle Entry
              </button>
            ) : (
              <p style={styles.success}>
                ✓ Vehicle entry has already been recorded.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  staffGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 20,
  },
  search: {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #e9eef5",
    borderRadius: 10,
    background: "#f8faff",
    color: "#172b4d",
    fontSize: 14,
    outline: "none",
    marginBottom: 18,
    boxSizing: "border-box",
  },
  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  bookingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    padding: 16,
    border: "1px solid #e9eef5",
    borderRadius: 12,
  },
  bookingActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  muted: {
    margin: "5px 0 0",
    color: "#71809a",
    fontSize: 13,
  },
  outlineButton: {
    padding: "9px 14px",
    background: "#fff",
    border: "1px solid #dce5ef",
    borderRadius: 8,
    color: "#172b4d",
    cursor: "pointer",
    fontWeight: 600,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10, 23, 54, 0.48)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 60px rgba(10,23,54,.2)",
  },
  closeButton: {
    border: "none",
    background: "#f1f4f8",
    borderRadius: 8,
    padding: "7px 10px",
    cursor: "pointer",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
    margin: "20px 0",
  },
  primaryButton: {
    width: "100%",
    padding: 13,
    border: "none",
    borderRadius: 9,
    background: "#0b9660",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  message: {
    color: "#b45309",
    fontSize: 13,
    marginBottom: 12,
  },
  success: {
    color: "#0b9660",
    fontWeight: 600,
  },
};
