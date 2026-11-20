
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STAFF_STORAGE_KEY = "parkmate_owner_staff";
const ACTIVITY_STORAGE_KEY = "parkmate_staff_activity";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [activities, setActivities] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [message, setMessage] = useState("");

  // Find the correct login session
  function getLoginStorage() {
    if (
      sessionStorage.getItem("pm_token") &&
      sessionStorage.getItem("pm_role") === "staff"
    ) {
      return sessionStorage;
    }

    if (
      localStorage.getItem("pm_token") &&
      localStorage.getItem("pm_role") === "staff"
    ) {
      return localStorage;
    }

    return null;
  }

  // Load logged-in staff
  useEffect(() => {
    const store = getLoginStorage();

    if (!store) {
      navigate("/login/staff", { replace: true });
      return;
    }

    const identifier = store.getItem("pm_user");

    let savedStaff = [];

    try {
      savedStaff = JSON.parse(
        localStorage.getItem(STAFF_STORAGE_KEY) || "[]"
      );
    } catch {
      savedStaff = [];
    }

    const currentStaff = savedStaff.find(
      (person) =>
        person.id?.toLowerCase() === identifier?.toLowerCase() &&
        person.status === "Active"
    );

    if (!currentStaff) {
      ["pm_token", "pm_role", "pm_user"].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      navigate("/login/staff", { replace: true });
      return;
    }

    setStaff(currentStaff);

    try {
      const savedActivities = JSON.parse(
        localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]"
      );

      setActivities(
        savedActivities.filter(
          (item) => item.staffId === currentStaff.id
        )
      );
    } catch {
      setActivities([]);
    }
  }, [navigate]);

  // Record vehicle entry or exit
  function handleVehicleAction(action) {
    if (!vehicleNumber.trim()) {
      setMessage("Please enter vehicle number.");
      return;
    }

    const activity = {
      id: Date.now(),
      staffId: staff.id,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      action,
      location: staff.location,
      gate: staff.gate,
      time: new Date().toLocaleString(),
    };

    let allActivities = [];

    try {
      allActivities = JSON.parse(
        localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]"
      );
    } catch {
      allActivities = [];
    }

    const updatedActivities = [activity, ...allActivities];

    localStorage.setItem(
      ACTIVITY_STORAGE_KEY,
      JSON.stringify(updatedActivities)
    );

    setActivities((previous) => [activity, ...previous]);
    setVehicleNumber("");

    setMessage(
      `Vehicle ${action.toLowerCase()} recorded successfully.`
    );
  }

  // Logout
  function handleLogout() {
    ["pm_token", "pm_role", "pm_user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/login/staff", { replace: true });
  }

  if (!staff) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        Loading Staff Dashboard...
      </div>
    );
  }

  const gate = (staff.gate || "").toLowerCase();
  const isEntryDuty = gate.includes("entry");
  const isExitDuty = gate.includes("exit");

  return (
    <div className="staff-dashboard">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .staff-dashboard {
          min-height: 100vh;
          background: #f4f7fb;
          color: #172033;
          font-family: Arial, sans-serif;
        }

        .staff-header {
          background: #111c35;
          color: white;
          padding: 20px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .staff-header h2 {
          margin: 0;
          font-size: 23px;
        }

        .staff-header button {
          background: white;
          color: #111c35;
          border: 0;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .staff-content {
          max-width: 1150px;
          margin: auto;
          padding: 35px 20px;
        }

        .staff-welcome {
          margin-bottom: 25px;
        }

        .staff-welcome h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .staff-welcome p {
          color: #64748b;
          margin: 0;
        }

        .staff-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .staff-card {
          background: white;
          padding: 23px;
          border-radius: 13px;
          box-shadow: 0 3px 15px #1720330c;
        }

        .staff-card span {
          display: block;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .staff-card h3 {
          margin: 0;
          font-size: 19px;
          overflow-wrap: anywhere;
        }

        .staff-panel {
          background: white;
          padding: 25px;
          border-radius: 13px;
          margin-bottom: 25px;
          box-shadow: 0 3px 15px #1720330c;
        }

        .staff-panel h2 {
          margin: 0 0 20px;
          font-size: 20px;
        }

        .staff-input {
          width: 100%;
          padding: 13px;
          border: 1px solid #dbe2ea;
          border-radius: 8px;
          font-size: 15px;
          margin-bottom: 15px;
        }

        .staff-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .staff-actions button {
          border: 0;
          border-radius: 8px;
          padding: 12px 20px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .entry-button {
          background: #16834a;
        }

        .exit-button {
          background: #2563eb;
        }

        .staff-message {
          margin-top: 15px;
          color: #16834a;
          font-size: 14px;
        }

        .staff-table-wrap {
          overflow-x: auto;
        }

        .staff-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }

        .staff-table th,
        .staff-table td {
          padding: 14px 10px;
          border-bottom: 1px solid #edf0f4;
          text-align: left;
          font-size: 14px;
        }

        .staff-table th {
          color: #64748b;
          font-weight: 600;
        }

        .staff-empty {
          color: #64748b;
          padding: 15px 0;
        }

        @media(max-width: 700px) {
          .staff-cards {
            grid-template-columns: 1fr;
          }

          .staff-header {
            padding: 17px 20px;
          }

          .staff-welcome h1 {
            font-size: 23px;
          }

          .staff-panel {
            padding: 18px;
          }
        }
      `}</style>

      <header className="staff-header">
        <h2>ParkMate Staff</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="staff-content">
        <section className="staff-welcome">
          <h1>Welcome, {staff.name || "Staff"}!</h1>
          <p>Manage your assigned parking gate operations.</p>
        </section>

        <section className="staff-cards">
          <div className="staff-card">
            <span>Staff ID</span>
            <h3>{staff.id}</h3>
          </div>

          <div className="staff-card">
            <span>Assigned Location</span>
            <h3>{staff.location || "Not assigned"}</h3>
          </div>

          <div className="staff-card">
            <span>Assigned Duty</span>
            <h3>{staff.gate || "Not assigned"}</h3>
          </div>
        </section>

        <section className="staff-panel">
          <h2>Vehicle Operations</h2>

          <input
            className="staff-input"
            type="text"
            placeholder="Enter vehicle number"
            value={vehicleNumber}
            onChange={(event) => {
              setVehicleNumber(event.target.value);
              setMessage("");
            }}
          />

          <div className="staff-actions">
            {isEntryDuty && (
              <button
                className="entry-button"
                onClick={() => handleVehicleAction("Entry")}
              >
                Record Vehicle Entry
              </button>
            )}

            {isExitDuty && (
              <button
                className="exit-button"
                onClick={() => handleVehicleAction("Exit")}
              >
                Record Vehicle Exit
              </button>
            )}

            {!isEntryDuty && !isExitDuty && (
              <p>
                Your gate duty is not assigned correctly.
                Contact the owner.
              </p>
            )}
          </div>

          {message && (
            <p className="staff-message">{message}</p>
          )}
        </section>

        <section className="staff-panel">
          <h2>Recent Vehicle Activity</h2>

          <div className="staff-table-wrap">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Action</th>
                  <th>Gate</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.vehicleNumber}</td>
                      <td>{activity.action}</td>
                      <td>{activity.gate || "-"}</td>
                      <td>{activity.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="staff-empty">
                      No vehicle activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
