import express, { Request, Response, Router } from "express";
import {
  AddDrawing,
  getAllDrawings,
  getDrawingById,
} from "../controllers/drawingController";

const router: Router = express.Router();
router.post("/add-drawing", AddDrawing);
router.get("/get-drawings", getAllDrawings);
router.get("/get-drawings/:id", getDrawingById);

export default router;
