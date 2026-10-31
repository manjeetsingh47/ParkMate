import { useState } from "react";
import { Navigate, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { SPOTS } from "../data.js";
import { freshBooking } from "../book/BookParts.jsx";
import { DetailsView, SlotView, TicketView } from "../book/BookViews.jsx";
import "../book/book.css";

/* /customer/book/:id  -> details   /slot -> pick slot   /ticket -> ticket.
   This layout route keeps the booking choices while you move between the three pages. */
function BookState({ spot }) {
  const [st, setSt] = useState(freshBooking);
  const set = (patch) => setSt((p) => ({ ...p, ...patch }));
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
  const nav = useNavigate();
  return <DetailsView spot={spot} st={st} onBack={() => nav("/customer/find")} onReserve={() => nav(`/customer/book/${spot.id}/slot`)} />;
}

export function BookSlot() {
  const { spot, st, set } = useOutletContext();
  const nav = useNavigate();
  return (
    <SlotView
      spot={spot}
      st={st}
      set={set}
      onBack={() => nav(`/customer/book/${spot.id}`)}
      onConfirm={() => nav(`/customer/book/${spot.id}/ticket`)}
    />
  );
}

export function BookTicket() {
  const { spot, st } = useOutletContext();
  const nav = useNavigate();
  if (!st.slots.length) return <Navigate to={`/customer/book/${spot.id}`} replace />; // e.g. after a page refresh
  return <TicketView spot={spot} st={st} onBack={() => nav(`/customer/book/${spot.id}/slot`)} onCancel={() => nav("/customer/find")} onBookings={() => nav("/customer/bookings")} />;
}
