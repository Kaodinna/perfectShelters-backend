import express, { Router } from "express";
import { AddComment } from "../controllers/commentController";

const router: Router = express.Router();
router.post("/add-comment", AddComment);
export default router;
