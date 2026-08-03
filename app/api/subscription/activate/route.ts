import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const subscriptionId = body?.subscriptionId as string | undefined;
    const status = body?.status as string | undefined;
    const email = body?.email as string | undefined;

    if (!subscriptionId || !status || !email) {
      return NextResponse.json(
        { error: "Missing subscription details." },
        { status: 400 },
      );
    }

    if (status !== "active") {
      return NextResponse.json(
        { error: "Subscription is not active." },
        { status: 400 },
      );
    }

    if (
      session.user.email.toLowerCase() !== decodeURIComponent(email).toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Email does not match your account." },
        { status: 403 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true, subscriptionId: true },
    });

    if (
      existingUser?.plan === "CREATOR" &&
      existingUser.subscriptionId === subscriptionId
    ) {
      return NextResponse.json({
        success: true,
        plan: "CREATOR",
        alreadyActive: true,
      });
    }

    const user = await db.user.update({
      where: { email: session.user.email },
      data: {
        plan: "CREATOR",
        subscriptionId,
        subscriptionStatus: status,
      },
      select: { plan: true },
    });

    return NextResponse.json({ success: true, plan: user.plan });
  } catch (error) {
    console.error("Subscription activation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to activate subscription.",
      },
      { status: 500 },
    );
  }
}
