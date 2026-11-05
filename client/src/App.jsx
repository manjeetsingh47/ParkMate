import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";
import Placeholder from "./Placeholder.jsx";
import { ROLES } from "./roles.js";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Signup from "./auth/signup.jsx";

import DashboardLayout from "./dashboard/DashboardLayout.jsx";
import CustomerHome from "./dashboard/pages/Home.jsx";
import FindParking from "./dashboard/pages/FindParking.jsx";
import MyBookings from "./dashboard/pages/MyBookings.jsx";
import Payments from "./dashboard/pages/Payments.jsx";
import Profile from "./dashboard/pages/Profile.jsx";

import BookLayout, {
  BookDetails,
  BookSlot,
  BookTicket,
} from "./dashboard/pages/Book.jsx";

import OwnerDashboard from "./owner/OwnerDashboard.jsx";

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

      {/* Login */}
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

      {/* Signup */}
      <Route
        path="/signup"
        element={<Navigate to="/signup/customer" replace />}
      />

      <Route
        path="/signup/customer"
        element={<Signup initialRole="user" />}
      />

      <Route
        path="/signup/host"
        element={<Signup initialRole="owner" />}
      />

      {/* Customer Dashboard */}
      <Route path="/customer" element={<DashboardLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route path="dashboard" element={<CustomerHome />} />
        <Route path="find" element={<FindParking />} />

        <Route path="book/:id" element={<BookLayout />}>
          <Route index element={<BookDetails />} />
          <Route path="slot" element={<BookSlot />} />
          <Route path="ticket" element={<BookTicket />} />
        </Route>

        <Route path="bookings" element={<MyBookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Owner Dashboard */}
      <Route
        path="/host/dashboard"
        element={<OwnerDashboard />}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={<Placeholder name="Admin dashboard" />}
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}