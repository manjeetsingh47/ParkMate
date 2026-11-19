export const STAFF_STORAGE_KEY = "parkmate_staff_accounts";
export const CUSTOMER_BOOKINGS_KEY = "parkmate_customer_bookings";

const seedStaff = [
  {
    id: "PM-STF-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    location: "City Centre Parking",
    gate: "Entry",
    status: "Active",
    password: "Park@123",
  },
  {
    id: "PM-STF-002",
    name: "Aman Verma",
    email: "aman@example.com",
    phone: "9876543211",
    location: "Mall Road Parking",
    gate: "Exit",
    status: "Active",
    password: "Park@123",
  },
  {
    id: "PM-STF-003",
    name: "Vikas Singh",
    email: "vikas@example.com",
    phone: "9876543212",
    location: "Business Hub Parking",
    gate: "Entry",
    status: "Inactive",
    password: "Park@123",
  },
];

export function readStaffAccounts() {
  try {
    const saved = localStorage.getItem(STAFF_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(seedStaff));
  } catch {
    // Storage can be unavailable in private browsing.
  }
  return seedStaff;
}

export function saveStaffAccounts(staff) {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
  } catch {
    // The backend will own persistent storage in the integrated application.
  }
}

export function createStaffId(staff) {
  const highest = staff.reduce((max, person) => {
    const match = String(person.id).match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  return `PM-STF-${String(highest + 1).padStart(3, "0")}`;
}

export function createTemporaryPassword() {
  return `PM@${Math.floor(100000 + Math.random() * 900000)}`;
}

export function readCustomerBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOMER_BOOKINGS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveCustomerBookings(bookings) {
  try {
    localStorage.setItem(CUSTOMER_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // Demo-only fallback. Backend persistence is required for shared devices.
  }
}

export function createUniqueEntryCode() {
  const existing = new Set(readCustomerBookings().map((booking) => booking.code));
  let code;
  do {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    code = `PM-${random}`;
  } while (existing.has(code));
  return code;
}
