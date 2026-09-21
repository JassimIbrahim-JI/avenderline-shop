# Tap Payments Qatar

Merchant setup for Tap, which is what the store uses for payments. Tap is the gateway most Qatar-registered stores use because it supports Apple Pay and settles directly in QAR to a local bank account.

## Sign up

Merchant signup: https://register.tap.company/qa

You get a test secret key right after signup — no waiting on paperwork to start testing.

## Documents for live activation

The activation team at Tap will ask for:

- Commercial Registration (CR) — current and valid
- Computer Card (Establishment ID) — showing authorized signatories
- Qatari ID for the owner / signatory — both sides
- IBAN certificate (or a bank statement from a Qatari bank) for the payout account
- Store URL — the live site so they can review terms and refund policy

## Test cards

These work on the sandbox. Use them to verify the checkout flow end to end:

- Visa, approved: `4000 0000 0000 0002`
- Mastercard, approved: `5105 1051 0510 5100`
- Apple Pay — toggle on the test device

For cards that should fail (insufficient funds, etc.), Tap publishes the full list in their docs.

## Where the keys go

Backend:

- `Tap:SecretKey` (or `Tap__SecretKey` in env vars) = the `sk_test_...` or `sk_live_...` from the Tap dashboard

You do not need to put the public key in the backend — the frontend gets a tokenized card session directly from Tap's hosted page in the redirect flow.

## Webhook

The backend has an endpoint that Tap calls when a charge succeeds. Wire the URL into the Tap dashboard under Developers → Webhooks. The route is under `OrdersController` (look for the `tap-webhook` action).

## Going live

- Swap `sk_test_...` for `sk_live_...` in prod
- Update the webhook URL to the production domain
- Test a real transaction with a small amount first
- Make sure the IBAN certificate matches the registered merchant name
