import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import Placeholder from "./Placeholder.jsx";
import { ROLES } from "./roles.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login/customer" replace />} />
      <Route path="/login" element={<Navigate to="/login/customer" replace />} />
      <Route path="/login/customer" element={<LoginPage role={ROLES.customer} />} />
      <Route path="/login/host" element={<LoginPage role={ROLES.host} />} />
      <Route path="/login/admin" element={<LoginPage role={ROLES.admin} />} />

      {/* Stand-ins for your real dashboards */}
      <Route path="/customer/dashboard" element={<Placeholder name="Customer dashboard" />} />
      <Route path="/host/dashboard" element={<Placeholder name="Parking holder dashboard" />} />
      <Route path="/admin/dashboard" element={<Placeholder name="Admin dashboard" />} />

      <Route path="*" element={<Navigate to="/login/customer" replace />} />
    </Routes>
  );
}