import { NextRequest, NextResponse } from "next/server";
import { generateOrderConfirmationEmailHtml, EmailOrderPayload } from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as EmailOrderPayload;

    if (!payload || !payload.orderNumber || !payload.email) {
      return NextResponse.json(
        { error: "Invalid order data: email and orderNumber are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Generate Haute Couture Email HTML
    const html = generateOrderConfirmationEmailHtml(payload);
    const subject = `Order Confirmation #${payload.orderNumber} â€” Avender Line Maison`;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "AvenderLine <onboarding@resend.dev>";

    if (!apiKey) {
      console.log(
        `[AvenderLine Email Service: Local/Simulated Mode]\n` +
        `  To: ${payload.email} (${payload.fullName})\n` +
        `  Order: #${payload.orderNumber}\n` +
        `  Total: ${payload.total} QAR\n` +
        `  Status: Generated successfully. Configure RESEND_API_KEY in production to send live emails via Resend.`
      );

      return NextResponse.json({
        success: true,
        mode: "simulated",
        message: "Email generated successfully (Simulated mode: set RESEND_API_KEY to send real emails)",
        orderNumber: payload.orderNumber,
        recipient: payload.email,
      });
    }

    // Live Resend API Call
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.email],
        subject: subject,
        html: html,
      }),
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[AvenderLine Email Service] Resend error:", data);
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to dispatch email via Resend.",
        },
        { status: resendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      mode: "live",
      id: data.id,
      orderNumber: payload.orderNumber,
    });
  } catch (error: any) {
    console.error("[AvenderLine Email Service] Internal error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error dispatching order email." },
      { status: 500 }
    );
  }
}


