import express, { Router } from "express";
import { AddPicture } from "../controllers/picture.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();
router.post("/add-picture", requireAuth, AddPicture);
export default router;
