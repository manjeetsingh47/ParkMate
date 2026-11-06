import React, { useMemo, useState } from "react";
import "./admin.css";

const initialOwners = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", location: "Mathura", date: "06 Nov 2026", status: "Pending" },
  { id: 2, name: "Amit Verma", email: "amit@gmail.com", location: "Agra", date: "05 Nov 2026", status: "Pending" },
  { id: 3, name: "Priya Singh", email: "priya@gmail.com", location: "Delhi", date: "04 Nov 2026", status: "Approved" },
];

const users = [
  { id: 1, name: "Rohan Kumar", email: "rohan@gmail.com", joined: "02 Nov 2026", status: "Active" },
  { id: 2, name: "Simran Kaur", email: "simran@gmail.com", joined: "03 Nov 2026", status: "Active" },
  { id: 3, name: "Arjun Singh", email: "arjun@gmail.com", joined: "04 Nov 2026", status: "Active" },
];

const bookings = [
  { id: "PM1001", customer: "Rohan Kumar", location: "City Mall Parking", date: "06 Nov 2026", amount: "₹120", status: "Confirmed" },
  { id: "PM1002", customer: "Simran Kaur", location: "Central Parking", date: "06 Nov 2026", amount: "₹80", status: "Completed" },
  { id: "PM1003", customer: "Arjun Singh", location: "Metro Parking", date: "05 Nov 2026", amount: "₹150", status: "Pending" },
  { id: "PM1004", customer: "Neha Gupta", location: "City Mall Parking", date: "05 Nov 2026", amount: "₹100", status: "Cancelled" },
];

const navigation = [
  { id: "Overview", icon: "▦", label: "Overview" },
  { id: "Owners", icon: "♙", label: "Owner Management" },
  { id: "Users", icon: "♧", label: "User Management" },
  { id: "Parking", icon: "▤", label: "Parking Management" },
  { id: "Bookings", icon: "▣", label: "Bookings" },
  { id: "Payments", icon: "₹", label: "Payments" },
  { id: "Reports", icon: "▥", label: "Reports & Analytics" },
  { id: "Support", icon: "◉", label: "Complaints" },
  { id: "Settings", icon: "⚙", label: "Settings" },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [owners, setOwners] = useState(initialOwners);
  const [search, setSearch] = useState("");

  const pendingOwners = owners.filter(
    (owner) => owner.status === "Pending"
  );

  const filteredOwners = useMemo(
    () =>
      owners.filter((owner) =>
        `${owner.name} ${owner.email} ${owner.location}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [owners, search]
  );

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter((booking) =>
    `${booking.id} ${booking.customer} ${booking.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateOwner = (id, status) => {
    setOwners((previous) =>
      previous.map((owner) =>
        owner.id === id ? { ...owner, status } : owner
      )
    );
  };

  const stats = [
    { title: "Total Users", value: "1,284", icon: "♧", change: "+12.5%", color: "blue" },
    { title: "Parking Owners", value: "86", icon: "♙", change: "+8.2%", color: "green" },
    { title: "Total Bookings", value: "3,642", icon: "▣", change: "+18.4%", color: "purple" },
    { title: "Total Revenue", value: "₹2,84,500", icon: "₹", change: "+15.3%", color: "orange" },
  ];

  const renderOverview = () => (
    <>
      <div className="admin-welcome">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Here's what's happening with your ParkMate platform today.</p>
        </div>
        <span className="admin-date">6 November 2026</span>
      </div>

      <div className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.title}>
            <div className={`admin-stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <p>{stat.title}</p>
            <h2>{stat.value}</h2>
            <span className="admin-growth">
              ↗ {stat.change} <small>vs last month</small>
            </span>
          </div>
        ))}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Recent Bookings</h3>
              <p>Latest parking reservations</p>
            </div>
            <button
              className="admin-text-btn"
              onClick={() => setActiveTab("Bookings")}
            >
              View all →
            </button>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 4).map((booking) => (
                  <tr key={booking.id}>
                    <td className="admin-id">{booking.id}</td>
                    <td>{booking.customer}</td>
                    <td>{booking.amount}</td>
                    <td>
                      <span className={`admin-status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Owner Approvals</h3>
              <p>Registration requests</p>
            </div>
            <span className="admin-count">{pendingOwners.length} Pending</span>
          </div>

          <div className="admin-owner-list">
            {pendingOwners.length === 0 ? (
              <p className="admin-empty">No pending owner requests.</p>
            ) : (
              pendingOwners.map((owner) => (
                <div className="admin-owner-item" key={owner.id}>
                  <div className="admin-avatar">
                    {owner.name.charAt(0)}
                  </div>
                  <div className="admin-owner-info">
                    <strong>{owner.name}</strong>
                    <span>{owner.location}</span>
                  </div>
                  <div className="admin-owner-actions">
                    <button
                      className="admin-approve"
                      onClick={() => updateOwner(owner.id, "Approved")}
                      title="Approve owner"
                    >
                      ✓
                    </button>
                    <button
                      className="admin-reject"
                      onClick={() => updateOwner(owner.id, "Rejected")}
                      title="Reject owner"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            className="admin-full-btn"
            onClick={() => setActiveTab("Owners")}
          >
            Manage all owners
          </button>
        </section>
      </div>

      <section className="admin-panel admin-revenue-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Revenue Summary</h3>
            <p>Monthly platform revenue (demo data)</p>
          </div>
          <strong className="admin-revenue-total">₹2,84,500</strong>
        </div>

        <div className="admin-bars">
          {[
            ["Jun", 35],
            ["Jul", 48],
            ["Aug", 42],
            ["Sep", 65],
            ["Oct", 76],
            ["Nov", 90],
          ].map(([month, height]) => (
            <div className="admin-bar-item" key={month}>
              <div className="admin-bar-track">
                <div
                  className="admin-bar-fill"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span>{month}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderOwners = () => (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>Owner Management</h3>
          <p>Review and manage parking owner registrations.</p>
        </div>
        <span className="admin-count">{pendingOwners.length} Pending</span>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Email</th>
              <th>Location</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.location}</td>
                <td>{owner.date}</td>
                <td>
                  <span className={`admin-status ${owner.status.toLowerCase()}`}>
                    {owner.status}
                  </span>
                </td>
                <td>
                  {owner.status === "Pending" ? (
                    <div className="admin-owner-actions">
                      <button className="admin-approve" onClick={() => updateOwner(owner.id, "Approved")}>✓</button>
                      <button className="admin-reject" onClick={() => updateOwner(owner.id, "Rejected")}>✕</button>
                    </div>
                  ) : (
                    <span className="admin-muted">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOwners.length === 0 && <p className="admin-empty">No owners found.</p>}
      </div>
    </section>
  );

  const renderUsers = () => (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>User Management</h3>
          <p>Registered ParkMate customers.</p>
        </div>
        <span className="admin-count">{users.length} Demo Users</span>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.joined}</td>
                <td><span className="admin-status approved">{user.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="admin-empty">No users found.</p>}
      </div>
    </section>
  );

  const renderBookings = () => (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h3>Booking Management</h3>
          <p>Monitor all parking reservations.</p>
        </div>
        <span className="admin-count">{bookings.length} Demo Bookings</span>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Parking Location</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="admin-id">{booking.id}</td>
                <td>{booking.customer}</td>
                <td>{booking.location}</td>
                <td>{booking.date}</td>
                <td>{booking.amount}</td>
                <td>
                  <span className={`admin-status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && <p className="admin-empty">No bookings found.</p>}
      </div>
    </section>
  );

  const renderSimpleSection = (title, description, message) => (
    <section className="admin-panel admin-coming-soon">
      <div className="admin-coming-icon">▦</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{message}</span>
    </section>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "Owners":
        return renderOwners();
      case "Users":
        return renderUsers();
      case "Bookings":
        return renderBookings();
      case "Parking":
        return renderSimpleSection("Parking Management", "Manage all parking locations and their slots.", "Next: parking location and slot management integration.");
      case "Payments":
        return renderSimpleSection("Payments & Transactions", "Monitor payments, refunds and platform revenue.", "Next: payment gateway and transaction integration.");
      case "Reports":
        return renderSimpleSection("Reports & Analytics", "Analyze bookings, revenue and platform activity.", "Next: live charts and downloadable reports.");
      case "Support":
        return renderSimpleSection("Complaints & Support", "Review customer and owner complaints.", "Next: complaint tracking and resolution workflow.");
      case "Settings":
        return renderSimpleSection("Admin Settings", "Manage your administrator account and platform preferences.", "Next: profile, password and platform settings.");
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">P</div>
          <div>
            <h2>ParkMate</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-sidebar-label">MAIN MENU</div>

        <nav className="admin-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setSearch("");
              }}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "Owners" && pendingOwners.length > 0 && (
                <span className="admin-nav-badge">{pendingOwners.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile-mini">
            <div className="admin-avatar admin-avatar-light">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Super Admin</span>
            </div>
          </div>
          <button
            className="admin-logout"
            onClick={() => window.location.href = "/login/admin"}
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">ParkMate / Admin /</span>
            <strong>{activeTab}</strong>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="admin-top-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
          <footer className="admin-footer">
            © 2026 ParkMate Admin Panel. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;