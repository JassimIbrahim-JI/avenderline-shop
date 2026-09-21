# AvenderLine

Qatari abaya store. Next.js frontend, .NET 8 API, Postgres or SQLite.

## Running it

The fastest setup is Docker:

```
docker compose up --build
```

API at `http://localhost:8080`, swagger at `/swagger`, Postgres comes up with seeded data.

Without Docker, start Postgres somewhere and then:

```
cd src/AvenderLine.API
dotnet run
```

DbInitializer applies migrations and seeds categories, products, and the default admin on startup.

Frontend:

```
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

Default dev admin is `admin@avenderline.com` / `Admin@1234`. Change it before going anywhere public.

## Layout

```
src/AvenderLine.Domain         entities and repository interfaces, no deps
src/AvenderLine.Application    services and DTOs
src/AvenderLine.Infrastructure EF Core, Identity, Tap, the concierge
src/AvenderLine.API            controllers and Program.cs
tests/AvenderLine.Tests        xUnit + Moq
frontend                       Next.js app
```

`API → Application → Domain` only. `Infrastructure` implements the contracts.

## Auth

JWT + ASP.NET Identity + hashed passwords (PBKDF2). Three roles:

- `Admin` — everything, including settings and brand.
- `Manager` — products and orders but not settings.
- `Customer` — browse, cart, checkout, track orders.

Policies on the controllers (`RequireAdmin`, `RequireCustomer`) keep the admin route locked down.

## Payments

Single gateway: Tap Payments (`tap.company/qa`). QAR settlement to Qatari bank accounts, Apple Pay, local debit cards, Visa, Mastercard.

The gateway goes through `IPaymentGateway` in Application. The Tap implementation in Infrastructure handles the redirect, the return URL, the webhook. If `Tap:SecretKey` is missing locally, it returns a fake success for development.

For registration and required documents see `TAP_PAYMENTS_QATAR_GUIDE.md`.

## AI concierge

Microsoft Semantic Kernel. The concierge can call a `SearchProducts` plugin against the real catalog, so when a customer asks for a black abaya it returns actual products instead of generic answers.

Config is `OpenAI:ApiKey` in `appsettings.json`. With no key it falls back to keyword search.

UI is English-only and LTR. Currency is QAR.

## Deploying

See `DEPLOYMENT.md`. Short version: Neon for the database, Railway for the API, Vercel for the frontend. A Hetzner VPS running the existing docker-compose is the cheap-and-everything-here option if you want to avoid splitting across providers.

## Notes

- Secrets stay in `.env` (or user-secrets locally). Nothing committed.
- Migrations live in `src/AvenderLine.Infrastructure/Migrations`. Add one with `dotnet ef migrations add <Name>` when you change an entity.
- Test tap cards and merchant onboarding are in `TAP_PAYMENTS_QATAR_GUIDE.md`.
- Operationally reference `PROJECT_GUIDE_EN.md`.
