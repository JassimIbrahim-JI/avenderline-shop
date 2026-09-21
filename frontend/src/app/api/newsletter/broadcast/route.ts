import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { generateNewsletterCampaignEmailHtml } from "@/lib/emailTemplates";
import { Subscriber } from "../route";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subject, content, buttonText, buttonUrl, testRecipient } = body;

    if (!title || !subject || !content) {
      return NextResponse.json(
        { error: "Campaign title, subject, and content are required." },
        { status: 400 }
      );
    }

    const html = generateNewsletterCampaignEmailHtml({
      title,
      subject,
      content,
      buttonText,
      buttonUrl,
    });

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "AvenderLine <onboarding@resend.dev>";

    // If test recipient provided, only send to them
    let targetEmails: string[] = [];
    if (testRecipient && testRecipient.trim()) {
      targetEmails = [testRecipient.trim()];
    } else {
      try {
        const fileContent = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
        const subscribers: Subscriber[] = JSON.parse(fileContent);
        targetEmails = subscribers
          .filter((s) => s.status === "Active")
          .map((s) => s.email);
      } catch {
        targetEmails = [];
      }
    }

    if (targetEmails.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found to broadcast to." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      console.log(
        `[AvenderLine Broadcast (Simulated)]\n` +
        `  Subject: ${subject}\n` +
        `  Target Count: ${targetEmails.length} recipients\n` +
        `  Recipients: ${targetEmails.join(", ")}\n` +
        `  Status: Broadcast simulated. Configure RESEND_API_KEY for live sending.`
      );

      return NextResponse.json({
        success: true,
        mode: "simulated",
        sentCount: targetEmails.length,
        recipients: targetEmails,
        message: `Campaign simulated successfully for ${targetEmails.length} recipients.`,
      });
    }

    // Live send loop with Resend
    let sentCount = 0;
    let failedCount = 0;

    for (const toEmail of targetEmails) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: subject,
            html: html,
          }),
        });

        if (res.ok) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      mode: "live",
      sentCount,
      failedCount,
      totalRecipients: targetEmails.length,
      message: `Broadcast delivered to ${sentCount} subscribers (${failedCount} failed).`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


