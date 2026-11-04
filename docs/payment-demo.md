# Payment demonstration

Open `/checkout/demo` for a public sample flow, or select **Testar checkout** on a creator profile. `/checkout` redirects to the explicit sample. Other handles load the real public creator profile and display an error when the profile cannot be found; they never silently become sample profiles.

The checkout is a browser-only demonstration. It does not call a payment processor, create subscriptions or transaction records, send receipts, grant paid access, or collect a real payment. The persistent notice and completion screen identify every outcome as simulated.

## Try the flow

1. Choose BRL, USD, or EUR. BRL displays the creator's configured monthly price; USD 9.90 and EUR 8.90 are independent illustrative prices, not exchange-rate conversions.
2. For a card, use **Preencher dados de teste**, or enter `4242 4242 4242 4242`, expiry `12/30`, and CVC `123`. Other values are rejected. Review, then simulate approval or refusal.
3. For Pix, select BRL and **Pix demonstrativo**, review, and generate the illustration. Copy the explicitly nonpayable example code and select **Simular Pix recebido**. The five-minute illustration can expire and be regenerated.
4. **Testar novamente** resets the demonstration. Returning to method selection clears the result; changing currency or method clears the card form.

Card field values exist only in the mounted form's memory. They are not put in URLs, local storage, logs, query state, API requests, or result objects. The form clears them before moving to review. The Pix illustration is not a payment QR and contains no recipient, Pix key, bank destination, or valid payment payload.

## Provider integration later

Keep this demo separate from a future live checkout. A live implementation needs server-created orders, a provider-hosted or tokenized card form, signed/idempotent webhook handling, verified settlement events, creator payout onboarding, and explicit access-grant logic. Existing CMS transaction reporting must show actual immutable provider events rather than simulated successes.

Tests in `apps/web/tests/payments/payment-demo.test.ts` cover the allowed test card, staged card/Pix transitions, refusal, currency restrictions, and the invariant that simulated outcomes never charge or grant access.
