
import { useState } from "react";
import "./OwnerDashboard.css";

const menu = [
  { id: "overview", icon: "▦", label: "Overview" },
  { id: "locations", icon: "⌖", label: "My Locations" },
  { id: "slots", icon: "▤", label: "Manage Slots" },
  { id: "bookings", icon: "▣", label: "Bookings" },
  { id: "earnings", icon: "₹", label: "Earnings & Payments" },
  { id: "analytics", icon: "▥", label: "Analytics" },
  { id: "reviews", icon: "☆", label: "Reviews" },
];

const initialLocations = [
  { id: 1, name: "City Centre Parking", address: "Sector 18, Noida", slots: 40, occupied: 28, rate: 40, status: "Active" },
  { id: 2, name: "Mall Road Parking", address: "Mall Road, Mathura", slots: 25, occupied: 16, rate: 30, status: "Active" },
  { id: 3, name: "Business Hub Parking", address: "Sector 62, Noida", slots: 30, occupied: 12, rate: 50, status: "Active" },
];

const initialBookings = [
  { id: "PM1024", customer: "Rahul Sharma", vehicle: "UP16 AB 1234", location: "City Centre Parking", slot: "A-12", date: "05 Nov 2026", time: "10:00 AM", amount: 120, status: "Active" },
  { id: "PM1023", customer: "Aman Verma", vehicle: "UP85 CD 5678", location: "Mall Road Parking", slot: "B-05", date: "05 Nov 2026", time: "09:30 AM", amount: 90, status: "Completed" },
  { id: "PM1022", customer: "Priya Singh", vehicle: "DL8C EF 9012", location: "Business Hub Parking", slot: "C-08", date: "05 Nov 2026", time: "08:00 AM", amount: 150, status: "Active" },
  { id: "PM1021", customer: "Karan Gupta", vehicle: "UP16 GH 3456", location: "City Centre Parking", slot: "A-15", date: "04 Nov 2026", time: "04:00 PM", amount: 80, status: "Completed" },
];

const initialSlots = [
  { id: "A-01", location: "City Centre Parking", type: "Car", status: "Available" },
  { id: "A-02", location: "City Centre Parking", type: "Car", status: "Booked" },
  { id: "A-03", location: "City Centre Parking", type: "Car", status: "Occupied" },
  { id: "A-04", location: "City Centre Parking", type: "Car", status: "Available" },
  { id: "A-05", location: "City Centre Parking", type: "Bike", status: "Maintenance" },
  { id: "A-06", location: "City Centre Parking", type: "Car", status: "Available" },
  { id: "A-07", location: "City Centre Parking", type: "Car", status: "Booked" },
  { id: "A-08", location: "City Centre Parking", type: "Car", status: "Available" },
  { id: "A-09", location: "City Centre Parking", type: "Car", status: "Occupied" },
  { id: "A-10", location: "City Centre Parking", type: "Bike", status: "Available" },
  { id: "B-01", location: "Mall Road Parking", type: "Car", status: "Available" },
  { id: "B-02", location: "Mall Road Parking", type: "Car", status: "Booked" },
];

function Icon({ children }) {
  return <span className="owner-icon">{children}</span>;
}

function Status({ value }) {
  return <span className={`owner-status ${value.toLowerCase()}`}>{value}</span>;
}

function OwnerDashboard() {
  const [active, setActive] = useState("overview");
  const [locations, setLocations] = useState(initialLocations);
  const [bookings, setBookings] = useState(initialBookings);
  const [slots, setSlots] = useState(initialSlots);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    slots: "",
    rate: "",
  });

  const totalSlots = locations.reduce((sum, item) => sum + item.slots, 0);
  const occupied = locations.reduce((sum, item) => sum + item.occupied, 0);
  const available = totalSlots - occupied;

  const totalRevenue = bookings.reduce((sum, item) => sum + item.amount, 0);
  const activeBookings = bookings.filter(item => item.status === "Active").length;

  const filteredBookings = bookings.filter(item =>
    `${item.id} ${item.customer} ${item.vehicle} ${item.location}`
      .toLowerCase().includes(search.toLowerCase())
  );

  function addLocation(e) {
    e.preventDefault();

    if (!newLocation.name.trim() || !newLocation.address.trim() ||
        Number(newLocation.slots) <= 0 || Number(newLocation.rate) <= 0) {
      return;
    }

    setLocations(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newLocation.name,
        address: newLocation.address,
        slots: Number(newLocation.slots),
        occupied: 0,
        rate: Number(newLocation.rate),
        status: "Active",
      },
    ]);

    setNewLocation({ name: "", address: "", slots: "", rate: "" });
    setShowAdd(false);
  }

  function updateSlot(id, status) {
    setSlots(prev => prev.map(slot =>
      slot.id === id ? { ...slot, status } : slot
    ));
  }

  function updateBooking(id, status) {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    ));
  }

  function renderOverview() {
    return (
      <>
        <div className="owner-welcome">
          <div>
            <p className="owner-eyebrow">OWNER WORKSPACE</p>
            <h1>Good morning, Manjeet 👋</h1>
            <p>Here's what's happening with your parking business today.</p>
          </div>
          <button className="owner-primary" onClick={() => setShowAdd(true)}>
            + Add Location
          </button>
        </div>

        <div className="owner-stats">
          <Stat icon="⌖" title="Total Locations" value={locations.length} note="Parking locations" />
          <Stat icon="▤" title="Total Parking Slots" value={totalSlots} note="Across all locations" />
          <Stat icon="▣" title="Active Bookings" value={activeBookings} note="Currently active" />
          <Stat icon="₹" title="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} note="Sample booking data" />
        </div>

        <div className="owner-content-grid">
          <section className="owner-panel">
            <div className="owner-panel-heading">
              <div>
                <h3>Parking Occupancy</h3>
                <p>Live overview of your parking capacity</p>
              </div>
              <span className="owner-live"><i /> Overview</span>
            </div>

            <div className="owner-occupancy">
              <div className="owner-donut" style={{
                background: `conic-gradient(#0b8a4a ${totalSlots ? occupied / totalSlots * 100 : 0}%, #e9eef7 0)`
              }}>
                <div>
                  <strong>{totalSlots ? Math.round(occupied / totalSlots * 100) : 0}%</strong>
                  <span>Occupied</span>
                </div>
              </div>
              <div className="owner-legend">
                <div><i className="dot green-dot" /><span>Occupied</span><b>{occupied}</b></div>
                <div><i className="dot grey-dot" /><span>Available</span><b>{available}</b></div>
                <div><i className="dot blue-dot" /><span>Total slots</span><b>{totalSlots}</b></div>
              </div>
            </div>
          </section>

          <section className="owner-panel">
            <div className="owner-panel-heading">
              <div>
                <h3>Quick Actions</h3>
                <p>Manage your parking business</p>
              </div>
            </div>
            <div className="owner-quick-actions">
              <button onClick={() => setShowAdd(true)}>
                <span>＋</span><div><b>Add Location</b><small>List a new parking space</small></div>
              </button>
              <button onClick={() => setActive("slots")}>
                <span>▤</span><div><b>Manage Slots</b><small>Update parking availability</small></div>
              </button>
              <button onClick={() => setActive("bookings")}>
                <span>▣</span><div><b>View Bookings</b><small>Check customer reservations</small></div>
              </button>
              <button onClick={() => setActive("analytics")}>
                <span>▥</span><div><b>View Analytics</b><small>Track your performance</small></div>
              </button>
            </div>
          </section>
        </div>

        <section className="owner-panel owner-table-panel">
          <div className="owner-panel-heading">
            <div>
              <h3>Your Parking Locations</h3>
              <p>Overview of all your listed parking spaces</p>
            </div>
            <button className="owner-text-btn" onClick={() => setActive("locations")}>View all →</button>
          </div>
          <LocationTable locations={locations.slice(0, 4)} />
        </section>

        <section className="owner-panel owner-table-panel">
          <div className="owner-panel-heading">
            <div>
              <h3>Recent Bookings</h3>
              <p>Latest customer reservations</p>
            </div>
            <button className="owner-text-btn" onClick={() => setActive("bookings")}>View all →</button>
          </div>
          <BookingTable bookings={bookings.slice(0, 4)} onUpdate={updateBooking} />
        </section>
      </>
    );
  }

  function renderLocations() {
    return (
      <>
        <PageHeading title="My Locations" subtitle="Manage all your listed parking properties."
          action={<button className="owner-primary" onClick={() => setShowAdd(true)}>+ Add Location</button>} />
        <div className="owner-location-cards">
          {locations.map(location => (
            <div className="owner-location-card" key={location.id}>
              <div className="owner-location-top">
                <div className="owner-location-symbol">⌖</div>
                <Status value={location.status} />
              </div>
              <h3>{location.name}</h3>
              <p>⌖ {location.address}</p>
              <div className="owner-location-numbers">
                <div><strong>{location.slots}</strong><small>Total slots</small></div>
                <div><strong>{location.occupied}</strong><small>Occupied</small></div>
                <div><strong>₹{location.rate}</strong><small>Per hour</small></div>
              </div>
              <div className="owner-progress"><span style={{ width: `${location.slots ? location.occupied / location.slots * 100 : 0}%` }} /></div>
              <button className="owner-outline-btn" onClick={() => {
                setActive("slots");
              }}>Manage Slots →</button>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderSlots() {
    return (
      <>
        <PageHeading title="Manage Parking Slots" subtitle="Monitor and update the availability of your parking spaces." />
        <div className="owner-panel">
          <div className="owner-panel-heading">
            <div><h3>Slot Availability</h3><p>Change a slot's status using the dropdown.</p></div>
          </div>
          <div className="owner-slot-legend">
            <span><i className="dot green-dot" /> Available</span>
            <span><i className="dot red-dot" /> Booked</span>
            <span><i className="dot blue-dot" /> Occupied</span>
            <span><i className="dot grey-dot" /> Maintenance</span>
          </div>
          <div className="owner-slot-grid">
            {slots.map(slot => (
              <div key={slot.id} className={`owner-slot ${slot.status.toLowerCase()}`}>
                <strong>{slot.id}</strong>
                <small>{slot.type}</small>
                <select value={slot.status} onChange={e => updateSlot(slot.id, e.target.value)}>
                  <option>Available</option>
                  <option>Booked</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  function renderBookings() {
    return (
      <>
        <PageHeading title="Bookings" subtitle="Track and manage all customer reservations." />
        <div className="owner-panel owner-table-panel">
          <div className="owner-panel-heading">
            <div><h3>All Reservations</h3><p>{bookings.length} sample booking records</p></div>
            <input className="owner-search" placeholder="Search booking..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <BookingTable bookings={filteredBookings} onUpdate={updateBooking} />
        </div>
      </>
    );
  }

  function renderEarnings() {
    return (
      <>
        <PageHeading title="Earnings & Payments" subtitle="Track your parking business revenue." />
        <div className="owner-stats">
          <Stat icon="₹" title="Total Revenue" value={`₹${totalRevenue}`} note="Sample data" />
          <Stat icon="↗" title="Completed Payments" value={bookings.filter(b => b.status === "Completed").length} note="Sample completed bookings" />
          <Stat icon="◷" title="Pending Payments" value={bookings.filter(b => b.status === "Active").length} note="Active booking records" />
          <Stat icon="▣" title="Transactions" value={bookings.length} note="Sample records" />
        </div>
        <section className="owner-panel owner-table-panel">
          <div className="owner-panel-heading"><div><h3>Transaction History</h3><p>Booking-wise payment records</p></div></div>
          <BookingTable bookings={bookings} onUpdate={updateBooking} />
        </section>
      </>
    );
  }

  function renderAnalytics() {
    const daily = [
      { day: "Mon", value: 35 },
      { day: "Tue", value: 60 },
      { day: "Wed", value: 45 },
      { day: "Thu", value: 80 },
      { day: "Fri", value: 55 },
      { day: "Sat", value: 95 },
      { day: "Sun", value: 70 },
    ];

    return (
      <>
        <PageHeading title="Analytics & Reports" subtitle="Understand your parking business performance." />
        <div className="owner-stats">
          <Stat icon="₹" title="Revenue" value={`₹${totalRevenue}`} note="Sample records" />
          <Stat icon="▣" title="Bookings" value={bookings.length} note="Total sample bookings" />
          <Stat icon="⌖" title="Locations" value={locations.length} note="Listed properties" />
          <Stat icon="▤" title="Occupancy" value={`${totalSlots ? Math.round(occupied / totalSlots * 100) : 0}%`} note="Current occupancy" />
        </div>
        <section className="owner-panel">
          <div className="owner-panel-heading"><div><h3>Weekly Occupancy Trend</h3><p>Illustrative weekly activity</p></div></div>
          <div className="owner-chart">
            {daily.map(item => (
              <div className="owner-chart-column" key={item.day}>
                <strong>{item.value}%</strong>
                <div className="owner-chart-track"><span style={{ height: `${item.value}%` }} /></div>
                <small>{item.day}</small>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderReviews() {
    return (
      <>
        <PageHeading title="Reviews & Ratings" subtitle="See what customers think about your parking spaces." />
        <div className="owner-panel owner-review-summary">
          <div className="owner-review-score">4.8 <span>★★★★★</span><small>Sample rating</small></div>
          <div><h3>Customer Feedback</h3><p>Review information will appear here when connected to your backend.</p></div>
        </div>
        {[
          ["Rahul Sharma", "City Centre Parking", "Very convenient location and easy booking experience."],
          ["Priya Singh", "Business Hub Parking", "Good parking space and reasonable pricing."],
          ["Aman Verma", "Mall Road Parking", "Smooth entry and exit process."],
        ].map((review, index) => (
          <div className="owner-panel owner-review" key={index}>
            <div><strong>{review[0]}</strong><span>★★★★★</span></div>
            <small>{review[1]}</small>
            <p>{review[2]}</p>
          </div>
        ))}
      </>
    );
  }

  const pageContent = {
    overview: renderOverview,
    locations: renderLocations,
    slots: renderSlots,
    bookings: renderBookings,
    earnings: renderEarnings,
    analytics: renderAnalytics,
    reviews: renderReviews,
  };

  return (
    <div className="owner-layout">
      <aside className="owner-sidebar">
        <div className="owner-brand">
          <div className="owner-brand-icon">P</div>
          <span>Park<span>Mate</span></span>
        </div>

        <div className="owner-sidebar-label">WORKSPACE</div>
        <nav className="owner-navigation">
          {menu.map(item => (
            <button key={item.id}
              className={`owner-nav-item ${active === item.id ? "selected" : ""}`}
              onClick={() => { setActive(item.id); setSearch(""); }}>
              <Icon>{item.icon}</Icon>
              {item.label}
              {item.id === "bookings" && <small>{activeBookings}</small>}
            </button>
          ))}
        </nav>

        <div className="owner-sidebar-bottom">
          <div className="owner-help"> 
            <strong>Need help?</strong>
            <p>We're here to support your business.</p>
            <button onClick={() => alert("Contact ParkMate support.")}>Contact Support →</button>
          </div>
          <button className="owner-logout" onClick={() => {
            localStorage.removeItem("pm_token");
            localStorage.removeItem("pm_role");
            sessionStorage.removeItem("pm_token");
            sessionStorage.removeItem("pm_role");
            window.location.href = "/login/host";
          }}>↪ Log out</button>
        </div>
      </aside>

      <main className="owner-main">
        <header className="owner-topbar">
          <div>
            <span className="owner-top-label">PARKING OWNER</span>
            <h2>Owner Dashboard</h2>
          </div>
          <div className="owner-top-actions">
            <button className="owner-notification" onClick={() => setShowNotifications(!showNotifications)}>♧<i /></button>
            <div className="owner-profile">
              <div className="owner-avatar">M</div>
              <div><strong>Manjeet Singh</strong><small>Parking Owner</small></div>
            </div>
            {showNotifications && (
              <div className="owner-notification-popup">
                <strong>Notifications</strong>
                <p>Welcome to your ParkMate Owner Dashboard.</p>
                <p>Your parking management workspace is ready.</p>
              </div>
            )}
          </div>
        </header>

        <div className="owner-page-content">
          {pageContent[active]()}
        </div>
        <footer className="owner-footer">© 2026 ParkMate. All rights reserved.</footer>
      </main>

      {showAdd && (
        <div className="owner-modal-backdrop" onClick={() => setShowAdd(false)}>
          <form className="owner-modal" onSubmit={addLocation} onClick={e => e.stopPropagation()}>
            <div className="owner-modal-heading">
              <div><h2>Add Parking Location</h2><p>Enter the details of your new property.</p></div>
              <button type="button" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <label>Location Name</label>
            <input required placeholder="e.g. City Centre Parking" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} />
            <label>Full Address</label>
            <input required placeholder="Enter complete address" value={newLocation.address} onChange={e => setNewLocation({...newLocation, address: e.target.value})} />
            <label>Total Parking Slots</label>
            <input required type="number" min="1" placeholder="e.g. 40" value={newLocation.slots} onChange={e => setNewLocation({...newLocation, slots: e.target.value})} />
            <label>Price Per Hour (₹)</label>
            <input required type="number" min="1" placeholder="e.g. 40" value={newLocation.rate} onChange={e => setNewLocation({...newLocation, rate: e.target.value})} />
            <div className="owner-modal-actions">
              <button type="button" className="owner-outline-btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="owner-primary">Save Location</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, title, value, note }) {
  return (
    <div className="owner-stat-card">
      <div className="owner-stat-top"><span>{title}</span><div>{icon}</div></div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function PageHeading({ title, subtitle, action }) {
  return (
    <div className="owner-page-heading">
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      {action}
    </div>
  );
}

function LocationTable({ locations }) {
  return (
    <div className="owner-table-scroll">
      <table className="owner-table">
        <thead><tr><th>LOCATION</th><th>TOTAL SLOTS</th><th>OCCUPIED</th><th>AVAILABLE</th><th>RATE / HR</th><th>STATUS</th></tr></thead>
        <tbody>
          {locations.map(item => (
            <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.address}</small></td>
              <td>{item.slots}</td><td>{item.occupied}</td>
              <td>{item.slots - item.occupied}</td><td>₹{item.rate}</td><td><Status value={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {locations.length === 0 && <p className="owner-empty">No locations added yet.</p>}
    </div>
  );
}

function BookingTable({ bookings, onUpdate }) {
  return (
    <div className="owner-table-scroll">
      <table className="owner-table">
        <thead><tr><th>BOOKING ID</th><th>CUSTOMER</th><th>VEHICLE</th><th>LOCATION / SLOT</th><th>DATE & TIME</th><th>AMOUNT</th><th>STATUS / ACTION</th></tr></thead>
        <tbody>
          {bookings.map(item => (
            <tr key={item.id}>
              <td><strong>{item.id}</strong></td>
              <td>{item.customer}</td>
              <td>{item.vehicle}</td>
              <td><strong>{item.location}</strong><small>{item.slot}</small></td>
              <td>{item.date}<small>{item.time}</small></td>
              <td><strong>₹{item.amount}</strong></td>
              <td>
                <Status value={item.status} />
                <select className="owner-booking-action" value={item.status} onChange={e => onUpdate(item.id, e.target.value)}>
                  <option>Active</option><option>Completed</option><option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 && <p className="owner-empty">No matching bookings found.</p>}
    </div>
  );
}

export default OwnerDashboard;
