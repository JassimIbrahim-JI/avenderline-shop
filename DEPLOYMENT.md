# Deployment

This is the runbook for getting the store online. The split is intentional: each layer on a separate managed service keeps the costs low and the scaling story simple.

Pieces:

- Database: Neon (Postgres, free tier is fine for a small store)
- API: Railway (auto-detects the Dockerfile)
- Frontend: Vercel (Next.js, free for hobby projects)
- Payments: Tap Payments (`tap.company/qa`)
- Images: anything that hosts URLs — Cloudinary, Unsplash, an S3 bucket

## Run locally without Docker

For quick work you don't need Docker. The backend falls back to SQLite when `Database__Provider` is `Sqlite` or unset.

Backend:

```
cd src/AvenderLine.API
dotnet run
```

It creates `avenderline.db` in the project folder on first run, applies the schema, and seeds categories, products, and the default admin.

Frontend:

```
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Swagger is at `http://localhost:5246/swagger` (or whatever port dotnet picks).

## Database on Neon

1. Sign in to neon.tech with Google or GitHub.
2. Create a project with whatever name you want.
3. Copy the connection string.
4. Either paste it into `appsettings.json` under `ConnectionStrings:DefaultConnection` or set `Database__Provider=PostgreSql` and `ConnectionStrings__DefaultConnection=...` in environment variables.

DbInitializer creates tables and seeds the data on first startup.

## API on Railway

1. New Project on railway.app, deploy from this GitHub repo.
2. Set the Dockerfile path to `src/AvenderLine.API/Dockerfile` and the context to the repo root.
3. Variables:

   - `ASPNETCORE_ENVIRONMENT=Production`
   - `Database__Provider=PostgreSql`
   - `ConnectionStrings__DefaultConnection=<neon connection string>`
   - `Jwt__Key=<at least 32 chars>`
   - `Jwt__Issuer=AvenderLine`
   - `Jwt__Audience=AvenderLine.API`
   - `Tap__SecretKey=<sk_test_... or sk_live_...>`
   - `Cors__Origins__0=<your vercel URL>`

4. Generate a public domain under Settings → Networking.

## Frontend on Vercel

1. New project, import this repo.
2. Framework preset: Next.js.
3. Root directory: `frontend`.
4. Environment variable: `NEXT_PUBLIC_API_URL=https://<your-railway-domain>/api`
5. Deploy.

## Tap Payments

See `TAP_PAYMENTS_QATAR_GUIDE.md` for the registration steps, the test cards, and the documents needed to go live.

`Tap:SecretKey` in the backend config is where the API key goes. Public key isn't needed for the server-side flow.

## Going live checklist

- [ ] Strong JWT key in production (32+ chars)
- [ ] `Tap:SecretKey` set to a live key, not test
- [ ] CORS origin restricted to the real frontend URL
- [ ] Database backed up (Neon does this automatically on paid plans)
- [ ] HTTPS only (Railway and Vercel both do this)
- [ ] Default admin password changed

## A cheaper alternative

Everything fits on a single Hetzner VPS (~€4-7/month): the existing `docker-compose.yml`, Caddy or Nginx for TLS, Let's Encrypt for the certificate. That option trades operational simplicity for raw cost.

## Notes on migrations

Whenever an entity changes, run from the repo root:

```
dotnet ef migrations add <Name> --project src/AvenderLine.Infrastructure --startup-project src/AvenderLine.API
```

Then commit the new files under `src/AvenderLine.Infrastructure/Migrations`. DbInitializer applies pending migrations on startup.
