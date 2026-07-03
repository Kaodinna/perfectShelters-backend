import express, { Router } from "express";
import {
  AddConstruction,
  getAllConstructions,
  deleteConstruct,
  getConstructById,
  updateConstruction,
} from "../controllers/construction.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();
router.post("/add-construction", requireAuth, AddConstruction);
router.put("/update-construction/:id", requireAuth, updateConstruction);
router.get("/get-all-construction", getAllConstructions);
router.delete("/delete-construction/:id", requireAuth, deleteConstruct);
router.get("/get-construction/:id", getConstructById);
export default router;
