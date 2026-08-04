import { DodoPayments } from "dodopayments";

// Use the key if it's set, otherwise an empty string.
// The actual API call will fail at request-time if the key is missing,
// but this avoids crashing the whole build when the env var isn't present.
const key = process.env.DODO_PAYMENTS_KEY || "";

export const dodoPayments = new DodoPayments({
  bearerToken: key,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
});
