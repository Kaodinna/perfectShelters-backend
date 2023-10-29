import express, { Router } from "express";
import {
  AddDrawing,
  getAllDrawings,
  getDrawingById,
  getDrawingsByParams,
} from "../controllers/drawingController";

const router: Router = express.Router();
router.post("/add-drawing", AddDrawing);
router.get("/get-drawings", getAllDrawings);
router.get("/get-drawings/:id", getDrawingById);
router.get("/search-drawings/:type?/:category?", getDrawingsByParams);

export default router;
