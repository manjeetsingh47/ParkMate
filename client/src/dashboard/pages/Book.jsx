
import { useState } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

import { SPOTS } from "../data.js";
import { freshBooking } from "../book/BookParts.jsx";
import { DetailsView, SlotView, TicketView } from "../book/BookViews.jsx";
import { processOnlinePayment } from "../services/paymentService.js";
import "../book/book.css";

const STORAGE_KEY = "parkmate_customer_bookings";

function readSavedBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBooking(booking) {
  const existing = readSavedBookings();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([booking, ...existing])
  );
}

function BookState({ spot }) {
  const [st, setSt] = useState(freshBooking);
  const set = (patch) => setSt((previous) => ({ ...previous, ...patch }));

  return <Outlet context={{ spot, st, set }} />;
}

export default function BookLayout() {
  const { id } = useParams();
  const spot = SPOTS.find((s) => String(s.id) === id);

  if (!spot) return <Navigate to="/customer/find" replace />;

  return <BookState key={spot.id} spot={spot} />;
}

export function BookDetails() {
  const { spot, st } = useOutletContext();
  const navigate = useNavigate();

  return (
    <DetailsView
      spot={spot}
      st={st}
      onBack={() => navigate("/customer/find")}
      onReserve={() => navigate(`/customer/book/${spot.id}/slot`)}
    />
  );
}

export function BookSlot() {
  const { spot, st, set } = useOutletContext();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  async function confirmBooking() {
    if (processing) return;

    setPaymentError("");

    const selectedSlots = st.slots || [];
    if (!selectedSlots.length) {
      setPaymentError("Please select at least one parking slot.");
      return;
    }

    const platesReady = selectedSlots.every(
      (slot) => (st.plates?.[slot] || "").replace(/\s/g, "").length >= 4
    );

    if (!platesReady) {
      setPaymentError("Please enter a valid vehicle number for every selected slot.");
      return;
    }

    const arrivalDate = new Date(st.arrival);

    if (Number.isNaN(arrivalDate.getTime()) || arrivalDate <= new Date()) {
      setPaymentError("Please select a future arrival date and time.");
      return;
    }

    const totalAmount =
      Number(spot.price) * Number(st.hours) * selectedSlots.length;

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      setPaymentError("Unable to calculate the booking amount.");
      return;
    }

    const bookingId = `PM-${Date.now().toString().slice(-8)}`;
    const paymentMethod = st.paymentMethod || "pay_at_parking";

    setProcessing(true);

    try {
      let paymentDetails = {
        paymentStatus: "Pay at Parking",
        paymentId: null,
        paymentProvider: null,
      };

      if (paymentMethod === "online") {
        const result = await processOnlinePayment({
          bookingId,
          amount: totalAmount,
          customer: {
            name: "",
            email: "",
            phone: "",
          },
        });

        if (!result.success || result.status !== "paid") {
          setPaymentError(
            result.message || "Payment was not completed. Please try again."
          );
          setProcessing(false);
          return;
        }

        paymentDetails = {
          paymentStatus: "Payment Successful",
          paymentId: result.paymentId,
          paymentProvider: result.provider,
        };
      }

      const endDate = new Date(
        arrivalDate.getTime() + Number(st.hours) * 60 * 60 * 1000
      );

      const formatDate = (date) =>
        date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

      const formatTime = (date) =>
        date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

      const booking = {
        id: bookingId,
        spot: spot.name,
        address: spot.address || spot.area || "Address not available",
        location: spot.address || spot.area || "",
        vehicle: selectedSlots
          .map((slot) => st.plates[slot])
          .join(", "),
        slots: [...selectedSlots],
        plates: { ...st.plates },
        date: formatDate(arrivalDate),
        time: `${formatTime(arrivalDate)} - ${formatTime(endDate)}`,
        arrival: arrivalDate.toISOString(),
        hours: Number(st.hours),
        amount: totalAmount,
        status: "upcoming",
        paymentMethod,
        paymentStatus: paymentDetails.paymentStatus,
        paymentId: paymentDetails.paymentId,
        paymentProvider: paymentDetails.paymentProvider,
        code: st.code,
        createdAt: new Date().toISOString(),
      };

      saveBooking(booking);

      set({
        bookingId,
        paymentStatus: paymentDetails.paymentStatus,
        paymentId: paymentDetails.paymentId,
        paymentProvider: paymentDetails.paymentProvider,
      });

      navigate(`/customer/book/${spot.id}/ticket`);
    } catch (error) {
      console.error("Booking/payment error:", error);
      setPaymentError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <SlotView
        spot={spot}
        st={st}
        set={set}
        onBack={() => navigate(`/customer/book/${spot.id}`)}
        onConfirm={confirmBooking}
        processing={processing}
        paymentError={paymentError}
      />

      {paymentError && (
        <div
          role="alert"
          style={{
            maxWidth: "700px",
            margin: "12px auto",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff1f0",
            color: "#b42318",
            border: "1px solid #fecdca",
            fontSize: "14px",
          }}
        >
          {paymentError}
        </div>
      )}
    </div>
  );
}

export function BookTicket() {
  const { spot, st } = useOutletContext();
  const navigate = useNavigate();

  if (!st.slots.length || !st.bookingId) {
    return <Navigate to={`/customer/book/${spot.id}`} replace />;
  }

  return (
    <TicketView
      spot={spot}
      st={st}
      onBack={() => navigate(`/customer/book/${spot.id}/slot`)}
      onCancel={() => navigate("/customer/bookings")}
      onBookings={() => navigate("/customer/bookings")}
    />
  );
}
