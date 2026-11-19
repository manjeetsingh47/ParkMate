
import { useState } from "react";

export default function LocationGateManagement({ locations = [] }) {
  const [gateStatuses, setGateStatuses] = useState({});

  function getGateStatus(locationId, gate) {
    return gateStatuses[`${locationId}-${gate}`] || "Open";
  }

  function toggleGate(locationId, gate) {
    const key = `${locationId}-${gate}`;

    setGateStatuses((previous) => ({
      ...previous,
      [key]: previous[key] === "Closed" ? "Open" : "Closed",
    }));
  }

  return (
    <div>
      <div className="owner-page-heading">
        <div>
          <h1>Location & Gate Management</h1>
          <p>
            Manage separate entry and exit gates for all your parking
            locations.
          </p>
        </div>
      </div>

      <div className="owner-stats">
        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Total Locations</span>
            <div>⌖</div>
          </div>
          <strong>{locations.length}</strong>
          <small>Registered parking locations</small>
        </div>

        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Total Gates</span>
            <div>⇄</div>
          </div>
          <strong>{locations.length * 2}</strong>
          <small>Entry and Exit gates</small>
        </div>

        <div className="owner-stat-card">
          <div className="owner-stat-top">
            <span>Closed Gates</span>
            <div>⊘</div>
          </div>
          <strong>
            {Object.values(gateStatuses).filter(
              (status) => status === "Closed"
            ).length}
          </strong>
          <small>Currently closed gates</small>
        </div>
      </div>

      {locations.length === 0 ? (
        <section className="owner-panel">
          <p className="owner-empty">
            No parking locations available. Add a location first.
          </p>
        </section>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {locations.map((location) => (
            <section className="owner-panel" key={location.id}>
              <div className="owner-panel-heading">
                <div>
                  <h3>{location.name}</h3>
                  <p>⌖ {location.address}</p>
                </div>

                <span className="owner-status active">
                  {location.status}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "16px",
                  marginTop: "20px",
                }}
              >
                {["Entry", "Exit"].map((gate) => {
                  const status = getGateStatus(location.id, gate);

                  return (
                    <div
                      key={gate}
                      style={{
                        border: "1px solid #e9eef5",
                        borderRadius: "12px",
                        padding: "20px",
                        background: "#f8faff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "16px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#71809a",
                              fontWeight: 600,
                            }}
                          >
                            PARKING GATE
                          </span>
                          <h3 style={{ margin: "5px 0" }}>
                            {gate} Gate
                          </h3>
                        </div>

                        <span
                          className={`owner-status ${
                            status === "Open" ? "active" : "cancelled"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "#71809a",
                          fontSize: "13px",
                          marginBottom: "18px",
                        }}
                      >
                        {gate === "Entry"
                          ? "For incoming vehicles and customer check-in."
                          : "For outgoing vehicles and customer check-out."}
                      </p>

                      <button
                        className="owner-outline-btn"
                        onClick={() =>
                          toggleGate(location.id, gate)
                        }
                      >
                        {status === "Open" ? "Close Gate" : "Open Gate"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px solid #e9eef5",
                  display: "flex",
                  gap: "24px",
                  flexWrap: "wrap",
                  color: "#5d6b88",
                  fontSize: "13px",
                }}
              >
                <span>
                  Total Slots: <strong>{location.slots}</strong>
                </span>
                <span>
                  Occupied: <strong>{location.occupied}</strong>
                </span>
                <span>
                  Available:{" "}
                  <strong>{location.slots - location.occupied}</strong>
                </span>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
