import express, { Router } from "express";
import { verifyPayment, getAllPurchases } from "../controllers/payment.controller";

const router: Router = express.Router();

router.post("/verify", verifyPayment);
router.get("/purchases", getAllPurchases);

export default router;
