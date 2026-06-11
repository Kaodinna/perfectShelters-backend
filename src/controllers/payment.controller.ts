import { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import Purchase from "../model/purchase.model";
import { PAYSTACK_SECRET_KEY, ADMIN_EMAIL, fromAdminMail } from "../config/db.config";
import {
  sendEmail,
  purchaseConfirmationHtml,
  purchaseAdminNotificationHtml,
} from "../utils/notification";

const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

async function recordPurchase(paystackTx: any): Promise<boolean> {
  const ref: string = paystackTx.reference;

  // Idempotent — skip if already recorded
  const existing = await Purchase.findOne({ transactionRef: ref });
  if (existing) return false;

  const meta = paystackTx.metadata?.custom_fields ?? [];
  const planDescription = meta.find((f: any) => f.variable_name === "plan")?.value ?? "";
  const planRef = meta.find((f: any) => f.variable_name === "ref_no")?.value ?? ref.split("-")[1] ?? "";
  const customerName = meta.find((f: any) => f.variable_name === "name")?.value ?? "";
  const email: string = paystackTx.customer?.email ?? "";
  const amount: number = (paystackTx.amount ?? 0) / 100;

  await Purchase.create({
    transactionRef: ref,
    planRef,
    planDescription,
    email,
    name: customerName,
    amount,
    status: "success",
    paystackData: paystackTx,
  });

  // Customer receipt
  await sendEmail(
    email,
    "Your Perfect Shelters plan purchase is confirmed",
    purchaseConfirmationHtml(customerName, planDescription, planRef, ref, amount)
  );

  // Admin notification
  if (ADMIN_EMAIL) {
    await sendEmail(
      ADMIN_EMAIL,
      `New purchase: ${planRef} — ₦${amount.toLocaleString()}`,
      purchaseAdminNotificationHtml(customerName, email, planDescription, planRef, ref, amount)
    );
  }

  return true;
}

// Called by the frontend immediately after Paystack popup callback
export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.body as { reference?: string };

  if (!reference) {
    return res.status(400).json({ success: false, message: "reference is required" });
  }

  try {
    const { data } = await axios.get(`${PAYSTACK_VERIFY_URL}/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const tx = data?.data;
    if (!tx || tx.status !== "success") {
      return res.status(402).json({ success: false, message: "Payment not successful" });
    }

    await recordPurchase(tx);

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      data: {
        reference: tx.reference,
        amount: tx.amount / 100,
        planRef: tx.metadata?.custom_fields?.find((f: any) => f.variable_name === "ref_no")?.value ?? "",
        plan: tx.metadata?.custom_fields?.find((f: any) => f.variable_name === "plan")?.value ?? "",
      },
    });
  } catch (err: any) {
    console.error("Payment verification error:", err?.response?.data ?? err.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Paystack webhook — receives raw body for HMAC verification
export const paystackWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;
  const rawBody = req.body as Buffer;

  if (!signature || !rawBody) {
    return res.status(400).send("Bad request");
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  let event: any;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).send("Invalid JSON");
  }

  // Acknowledge immediately — Paystack expects a 200 fast
  res.status(200).send("OK");

  if (event.event === "charge.success") {
    try {
      await recordPurchase(event.data);
    } catch (err) {
      console.error("Webhook recordPurchase error:", err);
    }
  }
};
