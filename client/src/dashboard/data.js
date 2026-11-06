
// ParkMate sample data - Mathura, Uttar Pradesh
// Replace sample data with backend API calls later.
// Coordinates are illustrative demo parking-point coordinates,
// not verified locations of actual parking facilities.

export const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

export const USER = {
  name: "Manjeet Singh",
  phone: "+91 98765 43210",
  email: "manjeet@example.com",
  vehicles: [
    { id: 1, number: "UP 85 AB 1234", type: "Car" },
    { id: 2, number: "UP 85 XY 9087", type: "Bike" },
  ],
};

// Sample parking locations
export const SPOTS = [
  {
    id: 1,
    art: "mall",
    name: "City Center Mall Parking",
    area: "Krishna Nagar",
    address: "Krishna Nagar, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4855,
    lng: 77.6810,
    km: 0.4,
    price: 40,
    rating: 4.6,
    reviews: 212,
    covered: true,
    ev: true,
    open24: false,
    free: 18,
    total: 120,
  },
  {
    id: 2,
    art: "station",
    name: "Station Road Lot",
    area: "Near Mathura Junction",
    address: "Near Mathura Junction, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4781,
    lng: 77.6722,
    km: 1.1,
    price: 25,
    rating: 4.2,
    reviews: 98,
    covered: false,
    ev: false,
    open24: true,
    free: 6,
    total: 40,
  },
  {
    id: 3,
    art: "park",
    name: "Green Park Residency Slot",
    area: "Janam Bhumi Road",
    address: "Janam Bhumi Road, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4924,
    lng: 77.6737,
    km: 1.6,
    price: 30,
    rating: 4.8,
    reviews: 54,
    covered: true,
    ev: false,
    open24: true,
    free: 2,
    total: 4,
  },
  {
    id: 4,
    art: "tech",
    name: "Tech Plaza Basement",
    area: "Dampier Nagar",
    address: "Dampier Nagar, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4990,
    lng: 77.6810,
    km: 2.3,
    price: 50,
    rating: 4.4,
    reviews: 167,
    covered: true,
    ev: true,
    open24: true,
    free: 41,
    total: 200,
  },
  {
    id: 5,
    art: "market",
    name: "Old Market Open Ground",
    area: "Holi Gate",
    address: "Holi Gate, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4992,
    lng: 77.6854,
    km: 2.9,
    price: 15,
    rating: 3.9,
    reviews: 73,
    covered: false,
    ev: false,
    open24: false,
    free: 25,
    total: 60,
  },
  {
    id: 6,
    art: "hospital",
    name: "Hospital Gate Parking",
    area: "Civil Lines",
    address: "Civil Lines, Mathura, Uttar Pradesh",
    city: "Mathura",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.4920,
    lng: 77.6860,
    km: 3.4,
    price: 35,
    rating: 4.5,
    reviews: 131,
    covered: false,
    ev: false,
    open24: true,
    free: 9,
    total: 50,
  },
];

// Sample booking data
export const BOOKINGS = [
  {
    id: "PM-1042",
    spot: "City Center Mall Parking",
    address: "Krishna Nagar, Mathura",
    vehicle: "UP 85 AB 1234",
    date: "31 Oct 2026",
    time: "10:30 AM – 1:30 PM",
    endsIn: "1h 24m",
    amount: 120,
    status: "active",
    code: "482913",
  },
  {
    id: "PM-1051",
    spot: "Tech Plaza Basement",
    address: "Dampier Nagar, Mathura",
    vehicle: "UP 85 AB 1234",
    date: "02 Nov 2026",
    time: "9:00 AM – 6:00 PM",
    amount: 450,
    status: "upcoming",
    code: "771204",
  },
  {
    id: "PM-1055",
    spot: "Station Road Lot",
    address: "Near Mathura Junction",
    vehicle: "UP 85 XY 9087",
    date: "05 Nov 2026",
    time: "6:00 AM – 10:00 AM",
    amount: 100,
    status: "upcoming",
    code: "330981",
  },
  {
    id: "PM-1020",
    spot: "Hospital Gate Parking",
    address: "Civil Lines, Mathura",
    vehicle: "UP 85 AB 1234",
    date: "24 Oct 2026",
    time: "11:00 AM – 2:00 PM",
    amount: 105,
    status: "completed",
    code: "120456",
  },
  {
    id: "PM-1011",
    spot: "Old Market Open Ground",
    address: "Holi Gate, Mathura",
    vehicle: "UP 85 XY 9087",
    date: "18 Oct 2026",
    time: "4:00 PM – 6:00 PM",
    amount: 30,
    status: "completed",
    code: "908812",
  },
  {
    id: "PM-1003",
    spot: "Green Park Residency Slot",
    address: "Janam Bhumi Road, Mathura",
    vehicle: "UP 85 AB 1234",
    date: "10 Oct 2026",
    time: "8:00 AM – 12:00 PM",
    amount: 120,
    status: "cancelled",
    code: "556310",
  },
];

// Sample payment transactions
export const TRANSACTIONS = [
  {
    id: "T-8841",
    title: "Booking PM-1042",
    date: "31 Oct 2026",
    amount: -120,
  },
  {
    id: "T-8802",
    title: "Wallet top-up (UPI)",
    date: "28 Oct 2026",
    amount: 500,
  },
  {
    id: "T-8760",
    title: "Booking PM-1020",
    date: "24 Oct 2026",
    amount: -105,
  },
  {
    id: "T-8711",
    title: "Refund PM-1003",
    date: "10 Oct 2026",
    amount: 120,
  },
  {
    id: "T-8690",
    title: "Booking PM-1011",
    date: "18 Oct 2026",
    amount: -30,
  },
];

// Saved payment methods
export const METHODS = [
  {
    id: 1,
    label: "UPI",
    detail: "manjeet@okbank",
    main: true,
  },
  {
    id: 2,
    label: "Visa card",
    detail: "•••• 4421",
    main: false,
  },
];

// Slot map for the Book popup
// Sample slot availability is generated from free/total counts.

export const SLOT_COLS = 5;
export const LOT_SIZE = 23;

export function makeSlots(spot) {
  const count = Math.min(spot.total, LOT_SIZE);

  const freeCount =
    spot.free >= spot.total
      ? count
      : Math.min(
          spot.free,
          Math.max(
            Math.round((spot.free / spot.total) * count),
            8
          ),
          count
        );

  let seed = spot.id * 9301 + 49297;

  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const idx = Array.from(
    { length: count },
    (_, i) => i
  );

  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }

  const free = new Set(idx.slice(0, freeCount));

  return Array.from({ length: count }, (_, i) => ({
    id: "P" + String(i + 1).padStart(2, "0"),
    booked: !free.has(i),
  }));
}
