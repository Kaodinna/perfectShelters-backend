"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.purchaseAdminNotificationHtml = exports.purchaseConfirmationHtml = exports.chatNotificationHtml = exports.mailSent = exports.sendEmail = void 0;
const resend_1 = require("resend");
const db_config_1 = require("../config/db.config");
const resend = new resend_1.Resend(db_config_1.RESEND_API_KEY);
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resend.emails.send({
            from: db_config_1.fromAdminMail || "Perfect Shelters <noreply@perfectshelters.ng>",
            to,
            subject,
            html,
        });
    }
    catch (err) {
        console.error("Email send failed:", err);
    }
});
exports.sendEmail = sendEmail;
// Legacy wrapper kept for account verification flow
const mailSent = (_from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.sendEmail)(to, subject, html);
});
exports.mailSent = mailSent;
const chatNotificationHtml = (visitorName, visitorPhone, adminChatUrl) => `
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
exports.chatNotificationHtml = chatNotificationHtml;
const purchaseConfirmationHtml = (customerName, planDescription, planRef, transactionRef, amount) => `
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
      .field { margin-bottom: 12px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
      .field:last-of-type { border-bottom: none; }
      .field span { font-size: 12px; color: #888; display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
      .field p { margin: 0; font-weight: 600; color: #111; }
      .amount { color: #1877F2; font-size: 22px; font-weight: bold; }
      .footer { padding: 16px 32px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <h1>Perfect Shelters — Payment Confirmed ✓</h1>
      </div>
      <div class="body">
        <p>Hi ${customerName || "there"},</p>
        <p>Thank you for your purchase! We have received your payment and will deliver your plan within <strong>24 hours</strong>.</p>
        <div class="field"><span>Plan</span><p>${planDescription}</p></div>
        <div class="field"><span>Plan Reference</span><p>${planRef}</p></div>
        <div class="field"><span>Amount Paid</span><p class="amount">₦${amount.toLocaleString()}</p></div>
        <div class="field"><span>Transaction Reference</span><p style="font-family:monospace;font-size:13px">${transactionRef}</p></div>
        <p style="margin-top:20px">If you have any questions, please WhatsApp us at <strong>+234 903 302 0343</strong>.</p>
      </div>
      <div class="footer">Perfect Shelters &nbsp;·&nbsp; This is an automated receipt</div>
    </div>
  </body>
  </html>
`;
exports.purchaseConfirmationHtml = purchaseConfirmationHtml;
const purchaseAdminNotificationHtml = (customerName, customerEmail, planDescription, planRef, transactionRef, amount) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; background: #f5f5f5; margin: 0; padding: 0; }
      .wrapper { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .header { background: #111; padding: 24px 32px; }
      .header h1 { color: #ffffff; margin: 0; font-size: 18px; }
      .body { padding: 28px 32px; }
      .badge { display: inline-block; background: #e6f4ea; color: #1a7f37; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
      .field { margin-bottom: 12px; }
      .field span { font-size: 12px; color: #888; display: block; margin-bottom: 2px; text-transform: uppercase; }
      .field p { margin: 0; font-weight: 600; color: #111; }
      .footer { padding: 16px 32px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header"><h1>New Purchase — Action Required</h1></div>
      <div class="body">
        <div class="badge">💰 Payment received</div>
        <div class="field"><span>Customer</span><p>${customerName || "N/A"}</p></div>
        <div class="field"><span>Email</span><p>${customerEmail}</p></div>
        <div class="field"><span>Plan</span><p>${planDescription}</p></div>
        <div class="field"><span>Plan Reference</span><p>${planRef}</p></div>
        <div class="field"><span>Amount</span><p>₦${amount.toLocaleString()}</p></div>
        <div class="field"><span>Transaction Reference</span><p style="font-family:monospace;font-size:13px">${transactionRef}</p></div>
        <p style="margin-top:20px;color:#555">Please deliver the plan to <strong>${customerEmail}</strong> within 24 hours.</p>
      </div>
      <div class="footer">Perfect Shelters Admin &nbsp;·&nbsp; Automated notification</div>
    </div>
  </body>
  </html>
`;
exports.purchaseAdminNotificationHtml = purchaseAdminNotificationHtml;
const emailHtml = (verifyUrl) => `
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
exports.emailHtml = emailHtml;
