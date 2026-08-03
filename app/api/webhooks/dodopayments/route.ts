import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { db } from "@/lib/prisma";

const webhookSecret = process.env.DODOPAYMENTS_WEBHOOK_SECRET!;

// ─── Map Dodo Payments product IDs back to our plan names ──────────────────
// Must match the reverse of PLAN_PRODUCT_MAP in the checkout route
function getPlanFromProductId(productId: string): string | null {
  if (productId === (process.env.DODO_PRODUCT_CREATOR || "pdt_placeholder_creator")) {
    return "CREATOR";
  }
  if (productId === (process.env.DODO_PRODUCT_PROFESSIONAL || "pdt_placeholder_professional")) {
    return "PROFESSIONAL";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    // Get webhook headers
    const webhookId = req.headers.get("webhook-id");
    const webhookSignature = req.headers.get("webhook-signature");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 },
      );
    }

    // Get raw body
    const body = await req.text();

    // Verify webhook signature
    const webhook = new Webhook(webhookSecret);

    try {
      await webhook.verify(body, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(body);
    console.log("WEBHOOK", payload.data);

    // Helper: extract the customer email and plan from the payload
    // The payload structure varies by event type, so we try a few paths
    const customerEmail: string | undefined =
      payload.data?.customer?.email ||
      payload.data?.email ||
      payload.data?.customer_email;

    const productId: string | undefined =
      payload.data?.product_id ||
      payload.data?.product?.id ||
      payload.data?.items?.[0]?.product_id;

    // Also check for metadata we passed during checkout
    const metaPlan: string | undefined =
      payload.data?.metadata?.plan;

    // Determine which plan to grant
    const planToGrant = metaPlan || (productId ? getPlanFromProductId(productId) : null);

    // Handle different webhook events
    switch (payload.type) {
      case "payment.succeeded":
        console.log("Payment succeeded:", payload.data);

        if (customerEmail && planToGrant) {
          // Find the user by email and upgrade their plan
          const updatedUser = await db.user.updateMany({
            where: { email: customerEmail },
            data: {
              plan: planToGrant as "CREATOR" | "PROFESSIONAL",
              subscriptionStatus: "active",
              subscriptionId: payload.data?.subscription_id || payload.data?.subscription?.id || null,
              customerId: payload.data?.customer?.id || payload.data?.customer_id || null,
            },
          });

          if (updatedUser.count > 0) {
            console.log(
              `✅ Upgraded user ${customerEmail} to plan: ${planToGrant}`
            );
          } else {
            console.log(
              `⚠️ No user found with email: ${customerEmail}`
            );
          }
        }
        break;

      case "payment.failed":
        console.log("Payment failed:", payload.data);
        break;

      case "subscription.created":
        console.log("Subscription created:", payload.data);

        if (customerEmail && planToGrant) {
          const updated = await db.user.updateMany({
            where: { email: customerEmail },
            data: {
              plan: planToGrant as "CREATOR" | "PROFESSIONAL",
              subscriptionStatus: "active",
              subscriptionId: payload.data?.subscription_id || payload.data?.id || null,
              customerId: payload.data?.customer?.id || payload.data?.customer_id || null,
            },
          });

          if (updated.count > 0) {
            console.log(
              `✅ Subscription active for ${customerEmail} → plan: ${planToGrant}`
            );
          } else {
            console.log(
              `⚠️ No user found with email: ${customerEmail}`
            );
          }
        }
        break;

      case "subscription.cancelled":
        console.log("Subscription cancelled:", payload.data);

        if (customerEmail) {
          // Downgrade the user back to FREE when subscription ends
          await db.user.updateMany({
            where: { email: customerEmail },
            data: {
              plan: "FREE",
              subscriptionStatus: "cancelled",
            },
          });
          console.log(
            `🔄 Downgraded user ${customerEmail} to FREE plan`
          );
        }
        break;

      case "subscription.updated":
        console.log("Subscription updated:", payload.data);
        // Could update subscriptionStatus if needed in the future
        break;

      default:
        console.log("Unhandled webhook event:", payload.type);
    }

    // Return success response
    return NextResponse.json(
      { received: true, type: payload.type },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
