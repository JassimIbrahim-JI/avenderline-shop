# Project Guide

Operational reference for the AvenderLine codebase. Read this when you're stuck on a specific subsystem.

## Folder layout

```
src/AvenderLine.Domain          entities, repository contracts, value objects
src/AvenderLine.Application     DTOs, service interfaces, business logic services
src/AvenderLine.Infrastructure  EF Core DbContext, repositories, Identity, Tap, Semantic Kernel
src/AvenderLine.API             controllers, Program.cs, DI, JWT, Swagger, rate limiting
tests/AvenderLine.Tests         xUnit + Moq
frontend                        Next.js app (App Router, TS, Tailwind, Framer Motion)
```

`API → Application → Domain`. `Infrastructure` references Application and Domain but never the other way around.

## Configuration

`appsettings.json` ships with the production-shaped defaults (Postgres, JWT placeholders, empty Tap/OpenAI keys). Override per environment with `appsettings.Development.json` (already includes a SQLite fallback for local dev) or environment variables using the `Section__Key` syntax.

Common overrides:

```
Database__Provider=Sqlite
Database__Provider=PostgreSql
ConnectionStrings__DefaultConnection=<connection string>
Jwt__Key=<32+ chars>
Tap__SecretKey=<sk_test_... or sk_live_...>
OpenAI__ApiKey=<your key>
Cors__Origins__0=https://your-frontend.example
```

## Auth flow

1. `POST /api/auth/register` with email + password — creates an `ApplicationUser` and assigns the `Customer` role.
2. `POST /api/auth/login` returns a JWT signed with `Jwt:Key`, valid for `Jwt:ExpiryHours` (default 6).
3. The frontend stores the token in `localStorage` and the `AuthContext` attaches it as `Authorization: Bearer ...` on every API request.
4. Controllers gate on `[Authorize(Policy = "RequireAdmin")]` or `RequireCustomer`. Anonymous users can only read the catalog.

To create an admin from scratch: insert a user row via `UserManager.CreateAsync` with the role `Admin`. The default admin in the seeder (`admin@avenderline.com` / `Admin@1234`) is only created if no admin exists yet.

## Cart and orders

- Cart: per-customer, persisted in `Carts` table (one row per customer). `CartService` keeps the API surface small (`GetCartAsync`, `AddItemAsync`, `RemoveItemAsync`, `ClearCartAsync`).
- Checkout: `OrderService.CheckoutAsync` snapshots product data into `OrderItems`, computes `Subtotal` / `ShippingCost` / `Total`, and asks `IPaymentGateway` to create a charge.
- Order lifecycle: `Pending → Paid → Processing → Shipped → Delivered`. The status history is appended to `OrderStatusHistory` for audit.

## Tap Payments

`IPaymentGateway` is the seam. `TapGateway` is the only implementation registered.

Charge creation flow:

1. Front-end POSTs checkout with chosen method (`tap`).
2. Backend asks Tap for a charge URL via `POST https://api.tap.company/v2/charges`.
3. Backend stores the order as `Pending` and returns the redirect URL.
4. Customer pays on Tap's hosted page.
5. Tap redirects to the configured return URL and pings the webhook (`tap-webhook` action in `OrdersController`).
6. Webhook flips the order to `Paid`, captures the tap charge id, and triggers the confirmation email.

If `Tap:SecretKey` is empty, the gateway simulates a success so checkout still works during development.

## AI concierge

`ConciergeService` calls Semantic Kernel with two registered plugins:

- `SearchProducts(query, maxResults)` — runs a full-text search against the catalog.
- `GetOrderStatus(orderNumber)` — looks up the live status of an order.

The system prompt encodes the brand persona ("Sheikha"), Qatari sizing rules, fabric care, and Doha weather context. When `OpenAI:ApiKey` is missing the fallback path matches order lookup, sizing, pricing, fabric care, weather, and bisht/abaya keywords against local heuristics and returns scripted English responses.

## Frontend

- Next.js 14 App Router with `frontend/src/app`.
- State: `CartContext` and `AuthContext`. There is no language toggle — UI is English-only and LTR.
- API base URL is read from `process.env.NEXT_PUBLIC_API_URL`; falls back to `http://localhost:5246/api` in dev.
- The hero, admin tables, and concierge UI all use Tailwind utility classes. There's no global CSS beyond `globals.css`.
- Demo products live in `frontend/src/lib/demo.ts` — replace with real API data once the backend is running.

## Testing

```
dotnet test
```

Unit tests cover `Money` arithmetic, `Cart` invariants, and `CartService` interactions with mocked repositories. Add new tests in `tests/AvenderLine.Tests/Application` (services) or `tests/AvenderLine.Tests/Domain` (domain logic). Mock with Moq.

## Things to know

- `DbInitializer` migrates the DB on startup. Delete the local SQLite file if you change the schema and want a clean seed.
- CORS allows `http://localhost:3000` by default. Add your production frontend to `Cors:Origins` in `appsettings.json` or via env var.
- The store ships with a default admin user. **Delete it before any non-local deploy.**
- Tap charges are created server-side; the public key never needs to live in the frontend bundle.
- For deployments, never commit secrets — use `appsettings.Production.json` excluded by `.gitignore`, Railway env vars, or user-secrets for local dev.
