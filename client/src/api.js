
const STAFF_STORAGE_KEY = "parkmate_owner_staff";

export async function login({ role, identifier, password }) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!identifier || !password) {
    throw new Error("Please enter your details.");
  }

  // STAFF LOGIN
  if (role === "staff") {
    const savedStaff = JSON.parse(
      localStorage.getItem(STAFF_STORAGE_KEY) || "[]"
    );

    const staff = savedStaff.find(
      (person) =>
        person.id?.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (
      !staff ||
      staff.password !== password ||
      staff.status !== "Active"
    ) {
      throw new Error("Invalid Staff ID or password.");
    }

    // Save Staff ID for Staff Dashboard
    localStorage.setItem("pm_user", staff.id);

    return {
      token: "parkmate-demo-staff-token",
      user: {
        role: "staff",
        identifier: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        location: staff.location,
        gate: staff.gate,
      },
    };
  }

  // CUSTOMER, OWNER AND ADMIN LOGIN
  if (password.length < 6) {
    throw new Error("Incorrect email/mobile or password.");
  }

  const base = identifier.includes("@")
    ? identifier.split("@")[0]
    : "";

  const name = base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return {
    token: "demo-token",
    user: {
      role,
      identifier,
      name,
    },
  };
}
