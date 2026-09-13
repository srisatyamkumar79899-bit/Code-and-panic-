# Skill Intelligence Platform — Combined Frontend

Open `index.html` first. It is the single sign-in and registration entry point.

- Choose **Employee** to open `employee/index.html`.
- Choose **Admin** to open `admin/dashboard.html`.
- For prototype login, enter any valid email and any password, then check the demo verification box. Registered users continue to use the password they created.
- Registration is frontend-only and displays a demo OTP in the page message area.

## Temporary authentication

The combined login stores a small browser-only session under `sip_session`. It is deliberately isolated in `index.html` beside the successful-login redirect. The Admin frontend also keeps `portalUser` only because its original dashboard uses that value for display.

Before connecting the database, replace the session-writing block marked **Temporary frontend-only session adapter** with the real `POST /auth/login` response and secure token handling. Map registration and password-reset events to API endpoints such as:

- `POST /auth/register`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/password-reset`
- `POST /auth/logout`

Do not treat this prototype's `localStorage` credentials or OTP as production authentication. Move authorization checks to the server and make the dashboards request role-specific data from protected endpoints.
