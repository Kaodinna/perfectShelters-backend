import express, { Router } from "express";
import { AddPicture } from "../controllers/picture.controller";

const router: Router = express.Router();
router.post("/add-picture", AddPicture);
export default router;
