import { DodoPayments } from "dodopayments";

const key = process.env.DODO_PAYMENTS_KEY;
if (!key) {
  throw new Error("DODO_PAYMENTS_KEY environment variable is not set.");
}
export const dodoPayments = new DodoPayments({
  bearerToken: key,
  environment: "test_mode",
});
