# Maven Backend

Django + DRF auth API for the Maven multi-agent content engine. This backend is the auth authority for the Next.js frontend in `../frontend`.

## Quick start

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux

python manage.py migrate
python manage.py runserver 8000
```

API base: `http://127.0.0.1:8000`

## Endpoints (match frontend contracts)

| Method | Path | Body / Auth | Success |
| --- | --- | --- | --- |
| POST | `/api/auth/register/` | `{ email, password, full_name }` | `{ access, refresh, user }` (`201`) |
| POST | `/api/auth/login/` | `{ email, password }` | `{ access, refresh, user }` |
| POST | `/api/auth/google/` | `{ id_token }` | `{ access, refresh, user }` |
| POST | `/api/auth/refresh/` | `{ refresh }` | `{ access }` |
| GET | `/api/auth/me/` | `Authorization: Bearer <access>` | `{ id, email, full_name }` |

`user` shape:

```json
{ "id": 1, "email": "you@example.com", "full_name": "Your Name" }
```

## Environment

| Variable | Purpose |
| --- | --- |
| `DJANGO_SECRET_KEY` | Django secret |
| `DJANGO_DEBUG` | `True` / `False` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts |
| `GOOGLE_CLIENT_ID` | Same Google OAuth **Web** client ID as frontend `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| `CORS_ALLOWED_ORIGINS` | Frontend origins |

## Google setup

1. Create an OAuth 2.0 Web client in Google Cloud Console.
2. Authorized JavaScript origins: `http://localhost:3000`
3. Set the client ID in:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. Frontend sends the GIS `credential` (ID token) to Next BFF → Django `/api/auth/google/`.
5. Django verifies the token audience against `GOOGLE_CLIENT_ID`.

## Tests

```bash
python manage.py test accounts
```

## Notes

- Custom user model uses **email** as the login identifier.
- Google-created users get an unusable password (email/password login will fail until they set one later).
- JWT lifetimes: access ~1 hour, refresh ~7 days (aligned with frontend cookie max-age).
