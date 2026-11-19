
import { useMemo, useState } from "react";

const initialStaff = [
  {
    id: "STF-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    location: "City Centre Parking",
    gate: "Entry",
    status: "Active",
  },
  {
    id: "STF-002",
    name: "Aman Verma",
    email: "aman@example.com",
    phone: "9876543211",
    location: "Mall Road Parking",
    gate: "Exit",
    status: "Active",
  },
  {
    id: "STF-003",
    name: "Vikas Singh",
    email: "vikas@example.com",
    phone: "9876543212",
    location: "Business Hub Parking",
    gate: "Entry",
    status: "Inactive",
  },
];

export default function StaffManagement({ locations = [] }) {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    location: locations[0]?.name || "",
    gate: "Entry",
  });

  const locationNames = locations.length
    ? locations.map((location) => location.name)
    : [
        "City Centre Parking",
        "Mall Road Parking",
        "Business Hub Parking",
      ];

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staff.filter((person) =>
      `${person.name} ${person.email} ${person.location} ${person.id}`
        .toLowerCase()
        .includes(query)
    );
  }, [staff, search]);

  const activeCount = staff.filter(
    (person) => person.status === "Active"
  ).length;

  const inactiveCount = staff.length - activeCount;

  function handleAddStaff(e) {
    e.preventDefault();

    if (
      !newStaff.name.trim() ||
      !newStaff.email.trim() ||
      !newStaff.phone.trim() ||
      !newStaff.location
    ) {
      return;
    }

    const person = {
      ...newStaff,
      id: `STF-${String(Date.now()).slice(-6)}`,
      status: "Active",
    };

    setStaff((previous) => [...previous, person]);

    setNewStaff({
      name: "",
      email: "",
      phone: "",
      location: locationNames[0] || "",
      gate: "Entry",
    });

    setShowForm(false);
  }

  function toggleStatus(id) {
    setStaff((previous) =>
      previous.map((person) =>
        person.id === id
          ? {
              ...person,
              status:
                person.status === "Active" ? "Inactive" : "Active",
            }
          : person
      )
    );
  }

  function handleDeleteStaff() {
    if (!deleteTarget) return;

    setStaff((previous) =>
      previous.filter((person) => person.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
  }

  return (
    <div className="staff-management">
      <div className="owner-page-heading">
        <div>
          <h1>Staff Management</h1>
          <p>
            Manage your parking staff, assign locations and control
            their gate responsibilities.
          </p>
        </div>

        <button
          className="owner-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Staff
        </button>
      </div>

      {/* Staff Statistics */}
      <div className="owner-stats">
        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Total Staff</span>
            <div>♙</div>
          </div>
          <strong>{staff.length}</strong>
          <small>All registered staff</small>
        </div>

        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Active Staff</span>
            <div>✓</div>
          </div>
          <strong>{activeCount}</strong>
          <small>Currently active</small>
        </div>

        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Inactive Staff</span>
            <div>◷</div>
          </div>
          <strong>{inactiveCount}</strong>
          <small>Currently inactive</small>
        </div>
      </div>

      {/* Staff List */}
      <section className="owner-panel owner-table-panel">
        <div className="owner-panel-heading">
          <div>
            <h3>All Staff Members</h3>
            <p>View and manage your assigned parking staff.</p>
          </div>

          <input
            className="owner-search"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="owner-table-scroll">
          <table className="owner-table">
            <thead>
              <tr>
                <th>STAFF MEMBER</th>
                <th>STAFF ID</th>
                <th>PHONE</th>
                <th>LOCATION</th>
                <th>GATE DUTY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.name}</strong>
                    <small>{person.email}</small>
                  </td>

                  <td>{person.id}</td>
                  <td>{person.phone}</td>
                  <td>{person.location}</td>
                  <td>{person.gate} Gate</td>

                  <td>
                    <span
                      className={`owner-status ${
                        person.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className="owner-outline-btn staff-toggle-btn"
                        onClick={() => toggleStatus(person.id)}
                      >
                        {person.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(person)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #f1caca",
                          borderRadius: "7px",
                          background: "#fff1f1",
                          color: "#c0392b",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <p className="owner-empty">
              No staff members found.
            </p>
          )}
        </div>
      </section>

      {/* Add Staff Modal */}
      {showForm && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <form
            className="owner-modal staff-modal"
            onSubmit={handleAddStaff}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-heading">
              <div>
                <h2>Add New Staff</h2>
                <p>
                  Enter staff details and assign their parking duty.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <label>Full Name</label>
            <input
              required
              placeholder="Enter staff name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  name: e.target.value,
                })
              }
            />

            <label>Email Address</label>
            <input
              required
              type="email"
              placeholder="staff@example.com"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  email: e.target.value,
                })
              }
            />

            <label>Phone Number</label>
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={newStaff.phone}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <label>Parking Location</label>
            <select
              required
              value={newStaff.location}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  location: e.target.value,
                })
              }
            >
              {locationNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <label>Gate Responsibility</label>
            <select
              value={newStaff.gate}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  gate: e.target.value,
                })
              }
            >
              <option value="Entry">Entry Gate</option>
              <option value="Exit">Exit Gate</option>
            </select>

            <div className="owner-modal-actions">
              <button
                type="button"
                className="owner-outline-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="owner-primary">
                Save Staff
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="owner-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-heading">
              <div>
                <h2>Delete Staff Member?</h2>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteTarget.name}</strong>?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ color: "#c0392b", fontSize: "13px" }}>
              This staff member will be removed from this demo list.
            </p>

            <div className="owner-modal-actions">
              <button
                type="button"
                className="owner-outline-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteStaff}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#c0392b",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
