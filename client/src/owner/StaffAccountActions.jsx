import { useState } from "react";
import { readStaffAccounts, saveStaffAccounts } from "../services/demoStore.js";

export default function StaffAccountActions({ staffId }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function updatePassword(event) {
    event.preventDefault();
    if (password.length < 8) return setMessage("Password must contain at least 8 characters.");
    if (password !== confirm) return setMessage("Passwords do not match.");
    try {
      if (import.meta.env.VITE_AUTH_MODE === "api") {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const token = localStorage.getItem("pm_token") || sessionStorage.getItem("pm_token");
        const response = await fetch(`${apiUrl}/api/auth/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword: password }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not update password.");
      } else {
        const staff = readStaffAccounts();
        const account = staff.find((person) => person.id === staffId);
        if (!account || account.password !== currentPassword) throw new Error("Current password is incorrect.");
        saveStaffAccounts(staff.map((person) => person.id === staffId ? { ...person, password } : person));
      }
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      setMessage(error.message || "Could not update password.");
    }
  }

  function logout() {
    ["pm_token", "pm_role", "pm_user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    window.location.href = "/login/staff";
  }

  return <>
    <button type="button" className="owner-outline-btn" onClick={() => { setOpen(true); setMessage(""); }}>Change Password</button>
    <button type="button" className="owner-outline-btn" onClick={logout}>Log out</button>
    {open && <div style={styles.overlay} onClick={() => setOpen(false)}>
      <form style={styles.modal} onSubmit={updatePassword} onClick={(event) => event.stopPropagation()}>
        <h3 style={{ marginTop: 0, color: "#172b4d" }}>Change Password</h3>
        <p style={{ color: "#8794a8", fontSize: 13 }}>Your assigned location and gate responsibility cannot be changed here.</p>
        <label style={styles.label}>Current Password</label>
        <input style={styles.input} type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required placeholder="Enter current password" />
        <label style={styles.label}>New Password</label>
        <input style={styles.input} type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="At least 8 characters" />
        <label style={styles.label}>Confirm New Password</label>
        <input style={styles.input} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required placeholder="Re-enter new password" />
        {message && <p role="status" style={{ color: message.includes("successfully") ? "#08733c" : "#b42318", fontSize: 13 }}>{message}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button type="button" className="owner-outline-btn" onClick={() => setOpen(false)}>Close</button>
          <button type="submit" className="owner-primary">Update Password</button>
        </div>
      </form>
    </div>}
  </>;
}

const styles = {
  overlay: { position: "fixed", inset: 0, zIndex: 1100, background: "rgba(10,23,54,.48)", display: "grid", placeItems: "center", padding: 18 },
  modal: { width: "min(430px,100%)", background: "#fff", borderRadius: 15, padding: 24, boxShadow: "0 24px 70px rgba(10,23,54,.2)" },
  label: { display: "block", margin: "14px 0 6px", color: "#24344d", fontSize: 13, fontWeight: 700 },
  input: { width: "100%", padding: "11px 12px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" },
};
