export interface EmailOrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface EmailOrderPayload {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  mapsUrl?: string;
  items: EmailOrderItem[];
  total: number;
  paymentMethod: string;
  createdAt?: string;
}

export function generateOrderConfirmationEmailHtml(order: EmailOrderPayload): string {
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #eeeeee;">
          <div style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #1c1b1b; margin-bottom: 4px;">
            ${item.name}
          </div>
          <div style="font-size: 12px; color: #777777;">
            Length: <strong style="color: #1c1b1b;">${item.size}</strong> Â· Qty: <strong style="color: #1c1b1b;">${item.quantity}</strong>
          </div>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-size: 13px; font-weight: 600; color: #1c1b1b; white-space: nowrap;">
          ${item.price * item.quantity} QAR
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - AvenderLine Maison</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1c1b1b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e9e6df; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Top Brand Accent -->
          <tr>
            <td style="background-color: #1c1b1b; height: 4px;"></td>
          </tr>

          <!-- Header / Wordmark -->
          <tr>
            <td align="center" style="padding: 40px 30px 25px 30px; border-bottom: 1px solid #f2eee8;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #1c1b1b;">
                AVENDER LINE
              </h1>
              <span style="display: block; margin-top: 6px; font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #8b7355; font-weight: 600;">
                HAUTE COUTURE MAISON Â· DOHA
              </span>
            </td>
          </tr>

          <!-- Salutation & Confirmation Message -->
          <tr>
            <td style="padding: 35px 35px 25px 35px;">
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-bottom: 8px;">
                ORDER CONFIRMATION Â· ØªØ£ÙƒÙŠØ¯ Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨
              </div>
              <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #1c1b1b; line-height: 1.3;">
                Thank you for your order, ${order.fullName}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #555555; line-height: 1.6; font-weight: 400;">
                We have received your bespoke commission for order <strong style="color: #1c1b1b; font-family: monospace;">#${order.orderNumber}</strong>. Our Doha atelier couturiers will prepare and finish your piece to the highest standards of Qatari craftsmanship.
              </p>

              <!-- Order Overview Pills -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; border: 1px solid #e9e6df; border-radius: 2px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 14px 18px; width: 50%; border-right: 1px solid #e9e6df;">
                    <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #777777;">Order Reference</div>
                    <div style="font-size: 13px; font-weight: 700; color: #1c1b1b; font-family: monospace; margin-top: 4px;">${order.orderNumber}</div>
                  </td>
                  <td style="padding: 14px 18px; width: 50%;">
                    <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #777777;">Order Date</div>
                    <div style="font-size: 13px; font-weight: 500; color: #1c1b1b; margin-top: 4px;">${dateStr}</div>
                  </td>
                </tr>
              </table>

              <!-- Purchased Pieces Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <thead>
                  <tr>
                    <th align="left" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #777777; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #1c1b1b;">
                      Creation Details
                    </th>
                    <th align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #777777; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #1c1b1b;">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Financial Summary -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #777777;">Payment Method</td>
                  <td style="padding: 6px 0; font-size: 12px; color: #1c1b1b; text-align: right; font-weight: 500;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #777777;">Qatar Express Delivery</td>
                  <td style="padding: 6px 0; font-size: 12px; color: #1c1b1b; text-align: right; font-weight: 500;">Complimentary</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; font-size: 14px; font-weight: 700; color: #1c1b1b; border-top: 1px solid #1c1b1b;">Total Amount Due</td>
                  <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 700; color: #8b7355; text-align: right; border-top: 1px solid #1c1b1b;">${order.total} QAR</td>
                </tr>
              </table>

              <!-- Delivery & WhatsApp Coordination Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f4; border: 1px solid #d6e5d8; border-radius: 2px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 12px; font-weight: 700; color: #1c1b1b; margin-bottom: 6px;">
                      ðŸ“ Delivery Address & WhatsApp Live Pin:
                    </div>
                    <div style="font-size: 12px; color: #444444; line-height: 1.5; margin-bottom: 10px;">
                      <strong>${order.city}</strong> Â· ${order.address}
                      ${order.mapsUrl ? `<br><a href="${order.mapsUrl}" style="color: #1a7f37; text-decoration: underline;">View Attached Google Maps Location â†—</a>` : ""}
                    </div>
                    <div style="font-size: 11.5px; color: #3b503e; line-height: 1.5; border-top: 1px dashed #c0d8c3; padding-top: 8px;">
                      ðŸ’¬ Our private courier will contact you on WhatsApp (<strong>${order.phone}</strong>) prior to dispatch to coordinate delivery timing and confirm your exact gate.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/97455551234?text=Hello%20AvenderLine,%20regarding%20my%20order%20${order.orderNumber}"
                       style="display: inline-block; background-color: #1c1b1b; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; border-radius: 1px;">
                      Contact Atelier WhatsApp Concierge
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #faf8f5; border-top: 1px solid #f2eee8; padding: 25px 35px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">
                AvenderLine Atelier Â· Doha, State of Qatar
              </p>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: #999999;">
                Client Relations: <a href="mailto:concierge@avenderline.com" style="color: #8b7355; text-decoration: none;">concierge@avenderline.com</a> Â· Instagram: <a href="https://instagram.com/avender_line" style="color: #8b7355; text-decoration: none;">@avender_line</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #aaaaaa; line-height: 1.4;">
                This receipt confirms your commission at AvenderLine. Complimentary bespoke alterations are available at our Doha atelier upon presentation of this order reference.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateNewsletterWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AvenderLine Maison</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1c1b1b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e9e6df; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <tr>
            <td style="background-color: #1c1b1b; height: 4px;"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 30px 25px 30px; border-bottom: 1px solid #f2eee8;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #1c1b1b;">
                AVENDER LINE
              </h1>
              <span style="display: block; margin-top: 6px; font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #8b7355; font-weight: 600;">
                HAUTE COUTURE MAISON Â· DOHA
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 35px 30px 35px;">
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-bottom: 8px;">
                WELCOME TO THE CIRCLE Â· Ø£Ù‡Ù„Ø§Ù‹ Ø¨ÙƒÙ… ÙÙŠ Ø¯Ø§Ø± Ø£ÙÙ†Ø¯Ø±
              </div>
              <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #1c1b1b; line-height: 1.3;">
                An Invitation to Pure Elegance
              </h2>
              <p style="margin: 0 0 18px 0; font-size: 13px; color: #555555; line-height: 1.6;">
                Thank you for joining AvenderLine Maison. You are now part of our private clientele circle, where Qatari haute couture meets contemporary minimalism.
              </p>
              <p style="margin: 0 0 25px 0; font-size: 13px; color: #555555; line-height: 1.6;">
                As a subscribed patron, you will receive privileged early previews of seasonal capsules, private salon invitations, and atelier bespoke stories before public releases.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; border: 1px solid #e9e6df; border-radius: 2px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 12px; font-weight: 700; color: #1c1b1b; margin-bottom: 4px;">
                      âœ¦ Bespoke Atelier Consultation
                    </div>
                    <div style="font-size: 12px; color: #666666; line-height: 1.5;">
                      Our creative directors and master couturiers in Doha are pleased to offer personalized sizing and fabric styling consultations via our private WhatsApp line.
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://avenderline.com"
                       style="display: inline-block; background-color: #1c1b1b; color: #ffffff; text-decoration: none; padding: 14px 36px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 1px;">
                      Explore Current Collection
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #faf8f5; border-top: 1px solid #f2eee8; padding: 25px 35px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">
                AvenderLine Atelier Â· Doha, State of Qatar
              </p>
              <p style="margin: 0; font-size: 11px; color: #999999;">
                Client Relations: <a href="mailto:concierge@avenderline.com" style="color: #8b7355; text-decoration: none;">concierge@avenderline.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateNewsletterCampaignEmailHtml(params: {
  title: string;
  subject: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1c1b1b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e9e6df; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <tr>
            <td style="background-color: #1c1b1b; height: 4px;"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 30px 25px 30px; border-bottom: 1px solid #f2eee8;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #1c1b1b;">
                AVENDER LINE
              </h1>
              <span style="display: block; margin-top: 6px; font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #8b7355; font-weight: 600;">
                HAUTE COUTURE MAISON Â· DOHA
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 35px 30px 35px;">
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-bottom: 8px;">
                ATELIER ANNOUNCEMENT
              </div>
              <h2 style="margin: 0 0 18px 0; font-size: 20px; font-weight: 600; color: #1c1b1b; line-height: 1.3;">
                ${params.title}
              </h2>
              <div style="font-size: 13px; color: #555555; line-height: 1.7; margin-bottom: 30px; white-space: pre-line;">
                ${params.content}
              </div>

              ${
                params.buttonUrl
                  ? `
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${params.buttonUrl}"
                       style="display: inline-block; background-color: #1c1b1b; color: #ffffff; text-decoration: none; padding: 14px 36px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 1px;">
                      ${params.buttonText || "Discover The Atelier"}
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color: #faf8f5; border-top: 1px solid #f2eee8; padding: 25px 35px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">
                AvenderLine Atelier Â· Doha, State of Qatar
              </p>
              <p style="margin: 0; font-size: 11px; color: #999999;">
                Client Relations: <a href="mailto:concierge@avenderline.com" style="color: #8b7355; text-decoration: none;">concierge@avenderline.com</a> Â· Instagram: <a href="https://instagram.com/avender_line" style="color: #8b7355; text-decoration: none;">@avender_line</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

