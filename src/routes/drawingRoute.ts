import express, { Request, Response, Router } from "express";
import { AddDrawing, getAllDrawings } from "../controllers/drawingController";

const router: Router = express.Router();
router.post("/add-drawing", AddDrawing);
router.get("/get-drawings", getAllDrawings);

export default router;
