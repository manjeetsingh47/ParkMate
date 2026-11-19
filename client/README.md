# ParkMate Client

React + Vite frontend for the ParkMate parking reservation project.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` if you need to configure backend or payment integration.

## Demo roles

- Customer: use any email/mobile and a password of at least 6 characters.
- Parking Owner: use any email/mobile and a password of at least 6 characters.
- Admin: use any work email and a password of at least 6 characters.
- Staff Entry demo: `PM-STF-001` / `Park@123`
- Staff Exit demo: `PM-STF-002` / `Park@123`

The Owner can create additional staff accounts in Owner Dashboard → Staff Management. The app generates a Staff ID and temporary password and shows them once after creation. Staff accounts can be activated/deactivated by the Owner. Staff can change their password but cannot change their assigned location or gate duty.

## Important demo limitations

The default authentication and payment modes are mock/demo modes. Demo account and booking data are stored in the current browser's local storage, so they are not shared across different devices or browsers. Real authentication, secure password handling, persistent booking/vehicle records, payment verification, and owner/staff cross-device synchronization require the backend API.

To use backend authentication, set `VITE_AUTH_MODE=api` and configure `VITE_API_URL`. The login endpoint is expected at `POST /api/auth/login` and should accept `{ role, identifier, password }`, returning `{ token, user }`. Staff password changes use `POST /api/auth/change-password` with `{ currentPassword, newPassword }` and the logged-in bearer token.
