import express, { Request, Response, Router } from "express";
import { AddDrawing } from "../controllers/drawingController";

const router: Router = express.Router();
router.post("/add-drawing", AddDrawing);

export default router;
