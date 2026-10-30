
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";
import Placeholder from "./Placeholder.jsx";
import { ROLES } from "./roles.js";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />

      {/* Login Pages */}
      <Route
        path="/login"
        element={<Navigate to="/login/customer" replace />}
      />

      <Route
        path="/login/customer"
        element={<LoginPage role={ROLES.customer} />}
      />

      <Route
        path="/login/host"
        element={<LoginPage role={ROLES.host} />}
      />

      <Route
        path="/login/admin"
        element={<LoginPage role={ROLES.admin} />}
      />

      {/* Dashboards */}
      <Route
        path="/customer/dashboard"
        element={<Placeholder name="Customer dashboard" />}
      />

      <Route
        path="/host/dashboard"
        element={<Placeholder name="Parking holder dashboard" />}
      />

      <Route
        path="/admin/dashboard"
        element={<Placeholder name="Admin dashboard" />}
      />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
