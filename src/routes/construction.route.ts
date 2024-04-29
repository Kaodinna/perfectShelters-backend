import express, { Router } from "express";
import {
  AddConstruction,
  getAllConstructions,
  deleteConstruct,
  getConstructById,
} from "../controllers/construction.controller";

const router: Router = express.Router();
router.post("/add-construction", AddConstruction);
router.get("/get-all-construction", getAllConstructions);
router.delete("/delete-construction/:id", deleteConstruct);
router.get("/get-construction/:id", getConstructById);
export default router;
