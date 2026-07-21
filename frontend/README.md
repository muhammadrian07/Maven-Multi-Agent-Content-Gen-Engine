# Maven Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS auth UI for the Maven multi-agent content engine. Django remains the auth authority; this app is a BFF that stores JWTs in httpOnly cookies.

## Quick start

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Django API origin (default `http://127.0.0.1:8000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Identity Services web client ID |

Never put Django secrets or Google client secrets in `NEXT_PUBLIC_*` vars.

## Auth flow

1. Browser submits email/password or a Google ID token to **Next.js** route handlers under `/api/auth/*`.
2. Those handlers call Django:
   - `POST /api/auth/register/`
   - `POST /api/auth/login/`
   - `POST /api/auth/google/` `{ id_token }`
   - `POST /api/auth/refresh/` `{ refresh }`
   - `GET /api/auth/me/` with `Authorization: Bearer <access>`
3. On success, Next sets httpOnly cookies: `maven_access`, `maven_refresh`.
4. UI reads the session only via `GET /api/auth/me` (no tokens in `localStorage`).

### Expected Django response shape

```json
{
  "access": "<jwt>",
  "refresh": "<jwt>",
  "user": {
    "id": 1,
    "email": "you@example.com",
    "full_name": "Your Name"
  }
}
```

## Google setup

1. Create an OAuth 2.0 Web client in Google Cloud Console.
2. Add authorized JavaScript origins: `http://localhost:3000`.
3. Put the client ID in `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
4. Django must verify the ID token on `POST /api/auth/google/` and return Maven JWTs.

Until the client ID is set, the Google button stays disabled with an inline help message.

## Pages

| Route | Behavior |
| --- | --- |
| `/login` | Email/password + Continue with Google |
| `/signup` | Register + Continue with Google |
| `/` | Protected stub; redirects to `/login` when unauthenticated |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
