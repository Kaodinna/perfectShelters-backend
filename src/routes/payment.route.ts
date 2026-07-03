import express, { Router } from "express";
import { verifyPayment, getAllPurchases } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/verify", verifyPayment);
router.get("/purchases", requireAuth, getAllPurchases);

export default router;
