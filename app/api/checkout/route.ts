import { auth } from "@/lib/auth";
import { dodoPayments } from "@/lib/payments/dodopayments";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const username = session.user.name || "UNKNOWN_USER";
    const email = session.user.email || "N/A";

    if (!username || !email) {
      return NextResponse.json(
        { error: "User information is missing." },
        { status: 400 },
      );
    }
    const body = await req.json();
    // validations logic
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    // Process the checkout logic here using the username and email
    const checkout = await dodoPayments.checkoutSessions.create({
      product_cart: [
        {
          product_id: "pdt_0NepeRJFaOCuAzpBbqEJY",
          quantity: 1,
        },
      ],
      customer: {
        name: username,
        email: email,
      },
      return_url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    });

    return NextResponse.json({
      message: "Checkout URL created successfully.",
      checkoutUrl: checkout.checkout_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
