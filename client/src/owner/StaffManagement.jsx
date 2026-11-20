
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "parkmate_owner_staff";

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

function loadStaff() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load staff:", error);
  }
  return initialStaff;
}

function generateStaffId(staff) {
  const numbers = staff.map((person) => {
    const match = String(person.id || "").match(/(?:PM-)?STF-(\d+)/);
    return match ? Number(match[1]) : 0;
  });

  return `PM-STF-${String(Math.max(0, ...numbers) + 1).padStart(3, "0")}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "PM@";

  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

function saveStaff(staff) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    return true;
  } catch (error) {
    console.error("Could not save staff:", error);
    return false;
  }
}

export default function StaffManagement({ locations = [] }) {
  const [staff, setStaff] = useState(loadStaff);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [createdStaff, setCreatedStaff] = useState(null);
  const [notice, setNotice] = useState("");

  const locationNames = locations.length
    ? locations.map((location) => location.name)
    : [
        "City Centre Parking",
        "Mall Road Parking",
        "Business Hub Parking",
      ];

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gate: "Entry",
  });

  useEffect(() => {
    saveStaff(staff);
  }, [staff]);

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

  const selectedStaff = staff.find(
    (person) => person.id === selectedStaffId
  );

  function closeAddStaffPopup() {
    setShowForm(false);
    setCreatedStaff(null);
  }

  function handleAddStaff(e) {
    e.preventDefault();

    if (
      !newStaff.name.trim() ||
      !newStaff.email.trim() ||
      !newStaff.phone.trim() ||
      !newStaff.location
    ) {
      setNotice("Please fill all staff details.");
      return;
    }

    const person = {
      ...newStaff,
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      phone: newStaff.phone.trim(),
      id: generateStaffId(staff),
      password: generatePassword(),
      status: "Active",
    };

    const updatedStaff = [...staff, person];

    setStaff(updatedStaff);
    saveStaff(updatedStaff);

    // Keep the same Add Staff popup open and show credentials inside it.
    setCreatedStaff(person);
    setNotice("");

    setNewStaff({
      name: "",
      email: "",
      phone: "",
      location: "",
      gate: "Entry",
    });
  }

  function handleViewCredentials(person) {
    let updatedPerson = person;

    if (!person.password) {
      updatedPerson = {
        ...person,
        password: generatePassword(),
      };

      const updatedStaff = staff.map((item) =>
        item.id === person.id ? updatedPerson : item
      );

      setStaff(updatedStaff);
      saveStaff(updatedStaff);
    }

    setSelectedStaffId(updatedPerson.id);
    setNotice("");
  }

  function handleResetPassword(person) {
    const updatedPerson = {
      ...person,
      password: generatePassword(),
    };

    const updatedStaff = staff.map((item) =>
      item.id === person.id ? updatedPerson : item
    );

    setStaff(updatedStaff);
    saveStaff(updatedStaff);

    if (createdStaff?.id === person.id) {
      setCreatedStaff(updatedPerson);
    }

    setSelectedStaffId(updatedPerson.id);
    setNotice("Password reset successfully. Save the new password.");
  }

  function toggleStatus(id) {
    const updatedStaff = staff.map((person) =>
      person.id === id
        ? {
            ...person,
            status:
              person.status === "Active" ? "Inactive" : "Active",
          }
        : person
    );

    setStaff(updatedStaff);
    saveStaff(updatedStaff);
  }

  function handleDeleteStaff() {
    if (!deleteTarget) return;

    const updatedStaff = staff.filter(
      (person) => person.id !== deleteTarget.id
    );

    setStaff(updatedStaff);
    saveStaff(updatedStaff);

    if (selectedStaffId === deleteTarget.id) {
      setSelectedStaffId(null);
    }

    if (createdStaff?.id === deleteTarget.id) {
      setCreatedStaff(null);
    }

    setDeleteTarget(null);
    setNotice("Staff member deleted.");
  }

  async function copyCredentials(person) {
    const text =
      `Staff Name: ${person.name}\n` +
      `Staff ID: ${person.id}\n` +
      `Password: ${person.password}\n` +
      `Location: ${person.location}\n` +
      `Gate: ${person.gate}\n` +
      `Login Page: /login/staff`;

    try {
      await navigator.clipboard.writeText(text);
      setNotice("Login details copied successfully.");
    } catch (error) {
      setNotice("Copy failed. Please copy the details manually.");
    }
  }

  return (
    <div className="staff-management">
      <style>{`
        .staff-credentials-modal {
          width: min(680px, calc(100vw - 32px));
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .staff-credentials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin: 22px 0;
        }

        .staff-credentials-grid > div {
          min-width: 0;
          padding: 14px;
          border: 1px solid #dce9e0;
          border-radius: 9px;
          background: #f5fbf7;
        }

        .staff-credentials-grid small {
          display: block;
          margin-bottom: 7px;
          color: #64748b;
        }

        .staff-credentials-grid strong {
          display: block;
          color: #173b29;
          overflow-wrap: anywhere;
        }

        .staff-success-heading {
          color: #176b3a;
          margin-bottom: 6px;
        }
      `}</style>

      <div className="owner-page-heading">
        <div>
          <h1>Staff Management</h1>
          <p>
            Manage your parking staff, assign locations and control
            their gate responsibilities.
          </p>
        </div>

        <button
          type="button"
          className="owner-primary"
          onClick={() => {
            setNotice("");
            setCreatedStaff(null);
            setShowForm(true);
          }}
        >
          + Add Staff
        </button>
      </div>

      {notice && (
        <div
          style={{
            padding: "12px 15px",
            marginBottom: "16px",
            borderRadius: "8px",
            background: "#eaf7ef",
            color: "#176b3a",
            border: "1px solid #c9e8d3",
          }}
        >
          {notice}
        </div>
      )}

      {/* Existing staff credentials popup */}
      {selectedStaff && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setSelectedStaffId(null)}
        >
          <section
            className="owner-modal staff-credentials-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-heading">
              <div>
                <h2>Staff Login Details</h2>
                <p>Save these credentials and share them with the staff member.</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStaffId(null)}
              >
                ✕
              </button>
            </div>

            <div className="staff-credentials-grid">
              <div>
                <small>Staff Name</small>
                <strong>{selectedStaff.name}</strong>
              </div>
              <div>
                <small>Staff ID</small>
                <strong>{selectedStaff.id}</strong>
              </div>
              <div>
                <small>Temporary Password</small>
                <strong>{selectedStaff.password || "Not available"}</strong>
              </div>
              <div>
                <small>Parking Location</small>
                <strong>{selectedStaff.location}</strong>
              </div>
              <div>
                <small>Gate Duty</small>
                <strong>{selectedStaff.gate} Gate</strong>
              </div>
              <div>
                <small>Login Page</small>
                <strong>/login/staff</strong>
              </div>
            </div>

            <div className="owner-modal-actions">
              <button
                type="button"
                className="owner-outline-btn"
                onClick={() => handleResetPassword(selectedStaff)}
              >
                Reset Password
              </button>

              <button
                type="button"
                className="owner-primary"
                onClick={() => copyCredentials(selectedStaff)}
              >
                Copy Login Details
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Staff statistics */}
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

      {/* Staff list */}
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
                        flexWrap: "wrap",
                        gap: "7px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        className="owner-outline-btn"
                        onClick={() => handleViewCredentials(person)}
                      >
                        View Login Details
                      </button>

                      <button
                        type="button"
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
            <p className="owner-empty">No staff members found.</p>
          )}
        </div>
      </section>

      {/* Add staff form AND credentials in the same popup */}
      {showForm && (
        <div
          className="owner-modal-backdrop"
          onClick={closeAddStaffPopup}
        >
          <div
            className="owner-modal staff-modal staff-credentials-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {createdStaff ? (
              <>
                <div className="owner-modal-heading">
                  <div>
                    <h2 className="staff-success-heading">
                      Staff Account Created!
                    </h2>
                    <p>
                      Save these login details and share them with your staff member.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeAddStaffPopup}
                  >
                    ✕
                  </button>
                </div>

                <div className="staff-credentials-grid">
                  <div>
                    <small>Staff Name</small>
                    <strong>{createdStaff.name}</strong>
                  </div>

                  <div>
                    <small>Staff ID</small>
                    <strong>{createdStaff.id}</strong>
                  </div>

                  <div>
                    <small>Temporary Password</small>
                    <strong>{createdStaff.password}</strong>
                  </div>

                  <div>
                    <small>Parking Location</small>
                    <strong>{createdStaff.location}</strong>
                  </div>

                  <div>
                    <small>Gate Duty</small>
                    <strong>{createdStaff.gate} Gate</strong>
                  </div>

                  <div>
                    <small>Login Page</small>
                    <strong>/login/staff</strong>
                  </div>
                </div>

                <div className="owner-modal-actions">
                  <button
                    type="button"
                    className="owner-outline-btn"
                    onClick={() => copyCredentials(createdStaff)}
                  >
                    Copy Login Details
                  </button>

                  <button
                    type="button"
                    className="owner-primary"
                    onClick={closeAddStaffPopup}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleAddStaff}>
                <div className="owner-modal-heading">
                  <div>
                    <h2>Add New Staff</h2>
                    <p>
                      Enter staff details and assign their parking duty.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeAddStaffPopup}
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
                  <option value="">Select parking location</option>

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
                    onClick={closeAddStaffPopup}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="owner-primary"
                  >
                    Create Staff Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
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
