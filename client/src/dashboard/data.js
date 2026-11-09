
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
  // MATHURA - 3 demo parking spots
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

  // AGRA - 2 demo parking spots
  {
    id: 4,
    art: "mall",
    name: "Taj View Parking Plaza",
    area: "Tajganj",
    address: "Tajganj, Agra, Uttar Pradesh",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.1685,
    lng: 78.0421,
    km: 1.0,
    price: 50,
    rating: 4.5,
    reviews: 145,
    covered: true,
    ev: true,
    open24: false,
    free: 24,
    total: 80,
  },
  {
    id: 5,
    art: "station",
    name: "Agra Cantt Parking Hub",
    area: "Agra Cantt",
    address: "Agra Cantt, Agra, Uttar Pradesh",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    lat: 27.1592,
    lng: 77.9900,
    km: 2.0,
    price: 30,
    rating: 4.3,
    reviews: 89,
    covered: false,
    ev: false,
    open24: true,
    free: 15,
    total: 60,
  },

  // DELHI - 2 demo parking spots
  {
    id: 6,
    art: "tech",
    name: "Connaught Place Parking",
    area: "Connaught Place",
    address: "Connaught Place, New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.6315,
    lng: 77.2167,
    km: 1.2,
    price: 60,
    rating: 4.4,
    reviews: 230,
    covered: true,
    ev: true,
    open24: false,
    free: 32,
    total: 100,
  },
  {
    id: 7,
    art: "mall",
    name: "Saket Metro Parking",
    area: "Saket",
    address: "Saket, New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.5245,
    lng: 77.2066,
    km: 2.5,
    price: 40,
    rating: 4.2,
    reviews: 117,
    covered: false,
    ev: false,
    open24: true,
    free: 20,
    total: 70,
  },

  // TAMIL NADU - 1 demo parking spot
  {
    id: 8,
    art: "park",
    name: "Marina Beach Parking",
    area: "Marina Beach",
    address: "Marina Beach, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    lat: 13.0500,
    lng: 80.2824,
    km: 1.5,
    price: 35,
    rating: 4.5,
    reviews: 176,
    covered: false,
    ev: false,
    open24: true,
    free: 28,
    total: 90,
  },

  // PUNJAB - 2 demo parking spots
  {
    id: 9,
    art: "market",
    name: "Golden Temple Parking",
    area: "Golden Temple Road",
    address: "Golden Temple Road, Amritsar, Punjab",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    lat: 31.6200,
    lng: 74.8765,
    km: 0.8,
    price: 40,
    rating: 4.6,
    reviews: 198,
    covered: false,
    ev: false,
    open24: true,
    free: 35,
    total: 100,
  },
  {
    id: 10,
    art: "tech",
    name: "Ludhiana City Parking",
    area: "Feroze Gandhi Market",
    address: "Feroze Gandhi Market, Ludhiana, Punjab",
    city: "Ludhiana",
    state: "Punjab",
    country: "India",
    lat: 30.9000,
    lng: 75.8573,
    km: 1.3,
    price: 30,
    rating: 4.3,
    reviews: 102,
    covered: true,
    ev: false,
    open24: false,
    free: 18,
    total: 60,
  },

  // RAJASTHAN - 1 additional demo spot
  {
    id: 11,
    art: "hospital",
    name: "Jaipur City Parking Hub",
    area: "MI Road",
    address: "MI Road, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    lat: 26.9157,
    lng: 75.8070,
    km: 1.0,
    price: 35,
    rating: 4.4,
    reviews: 91,
    covered: true,
    ev: false,
    open24: true,
    free: 22,
    total: 75,
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
