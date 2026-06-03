import { Resend } from "resend";
import { RESEND_API_KEY, fromAdminMail, userSubject } from "../config/db.config";

const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await resend.emails.send({
      from: fromAdminMail || "Perfect Shelters <noreply@perfectshelters.ng>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

// Legacy wrapper kept for account verification flow
export const mailSent = async (
  _from: string,
  to: string,
  subject: string,
  html: string
) => {
  return sendEmail(to, subject, html);
};

export const chatNotificationHtml = (
  visitorName: string,
  visitorPhone: string | undefined,
  adminChatUrl: string
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>
      body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; background: #f5f5f5; margin: 0; padding: 0; }
      .wrapper { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .header { background: #1877F2; padding: 24px 32px; }
      .header h1 { color: #ffffff; margin: 0; font-size: 18px; }
      .body { padding: 28px 32px; }
      .badge { display: inline-block; background: #e8f0fe; color: #1877F2; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
      .field { margin-bottom: 12px; }
      .field span { font-size: 12px; color: #888; display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
      .field p { margin: 0; font-weight: 600; color: #111; }
      .btn { display: inline-block; margin-top: 24px; padding: 13px 28px; background: #1877F2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; }
      .footer { padding: 16px 32px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <h1>Perfect Shelters — New Chat</h1>
      </div>
      <div class="body">
        <div class="badge">🟢 New conversation started</div>
        <div class="field">
          <span>Visitor name</span>
          <p>${visitorName}</p>
        </div>
        ${visitorPhone ? `<div class="field"><span>Phone</span><p>${visitorPhone}</p></div>` : ""}
        <a href="${adminChatUrl}" class="btn">Open Chat Dashboard →</a>
      </div>
      <div class="footer">Perfect Shelters Admin &nbsp;·&nbsp; This is an automated notification</div>
    </div>
  </body>
  </html>
`;

export const emailHtml = (verifyUrl: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>
      body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; }
      .email-container { max-width: 700px; margin: auto; padding: 50px 20px; border: 1px solid #e0e0e0; }
      .email-heading { text-align: center; text-transform: uppercase; color: #1877F2; }
      .btn { display: inline-block; padding: 12px 24px; background-color: #1877F2; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2 class="email-heading">Welcome to Perfect Shelters</h2>
      <p>Thank you for registering! Please click the button below to verify your account.</p>
      <p><a href="${verifyUrl}" class="btn">Verify My Account</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verifyUrl}</p>
      <p>This link expires in 24 hours.</p>
    </div>
  </body>
  </html>
`;
