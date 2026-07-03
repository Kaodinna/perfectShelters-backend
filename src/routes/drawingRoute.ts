import express, { Router } from "express";
import {
  AddDrawing,
  getAllDrawings,
  getDrawingById,
  getDrawingsByParams,
  editDrawing,
  deleteDrawing,
} from "../controllers/drawingController";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();
router.post("/add-drawing", requireAuth, AddDrawing);
router.post("/edit-drawing/:id", requireAuth, editDrawing);
router.delete("/delete-drawing/:id", requireAuth, deleteDrawing);
router.get("/get-drawings", getAllDrawings);
router.get("/get-drawings/:id", getDrawingById);
router.get("/search-drawings/:type?/:category?", getDrawingsByParams);

export default router;
