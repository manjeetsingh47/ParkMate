// Replace this with your real backend call.
// It should POST to something like /api/auth/login with { role, identifier, password }
// and return { token, user }.
export async function login({ role, identifier, password }) {
  await new Promise((r) => setTimeout(r, 700)); // fake network delay

  if (!identifier || !password) {
    throw new Error("Please enter your details.");
  }
  if (password.length < 6) {
    throw new Error("Incorrect email/mobile or password.");
  }

  // Demo name taken from the email ("manjeet.singh@x.com" -> "Manjeet Singh").
  // Replace with the real name your backend returns.
  const base = identifier.includes("@") ? identifier.split("@")[0] : "";
  const name = base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return { token: "demo-token", user: { role, identifier, name } };
}