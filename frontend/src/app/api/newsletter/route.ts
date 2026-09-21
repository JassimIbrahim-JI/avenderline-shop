import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { generateNewsletterWelcomeEmailHtml } from "@/lib/emailTemplates";

export interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
  status: "Active" | "Unsubscribed";
}

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

// Helper to ensure data file exists
async function getSubscribers(): Promise<Subscriber[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, initialize with empty array or seed sample
    const initial: Subscriber[] = [
      {
        email: "patron.client@qatar.qa",
        subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        source: "atelier_concierge",
        status: "Active",
      },
      {
        email: "couture.lover@doha.com",
        subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        source: "footer",
        status: "Active",
      }
    ];
    try {
      await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    } catch {
      return [];
    }
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

// GET: List all subscribers (for Admin Panel)
export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.sort(
        (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
      ),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new subscriber (from Footer or Checkout)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const source = body?.source || "storefront_footer";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const subscribers = await getSubscribers();
    const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === email);

    if (existingIndex >= 0) {
      if (subscribers[existingIndex].status === "Unsubscribed") {
        // Re-activate
        subscribers[existingIndex].status = "Active";
        subscribers[existingIndex].subscribedAt = new Date().toISOString();
        await saveSubscribers(subscribers);
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        });
      }

      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You are already part of our private clientele circle.",
      });
    }

    // Add new subscriber
    const newSub: Subscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      source,
      status: "Active",
    };

    subscribers.push(newSub);
    await saveSubscribers(subscribers);

    // If Resend API Key is configured, attempt to send welcoming Haute Couture note
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "AvenderLine <onboarding@resend.dev>";
      const welcomeHtml = generateNewsletterWelcomeEmailHtml(email);
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: "Welcome to AvenderLine Maison â€” Doha Haute Couture",
            html: welcomeHtml,
          }),
        });
      } catch (err) {
        console.warn("[Newsletter] Failed to dispatch welcome email via Resend:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for joining AvenderLine PrivÃ©.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Unsubscribe or delete subscriber (Admin action or unsub link)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email query param is required." }, { status: 400 });
    }

    const subscribers = await getSubscribers();
    const updated = subscribers.filter((s) => s.email.toLowerCase() !== email);
    await saveSubscribers(updated);

    return NextResponse.json({
      success: true,
      message: `Subscriber ${email} removed.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

