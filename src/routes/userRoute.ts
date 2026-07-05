import express, { Router } from "express";
import { Login } from "../controllers/userController";

const router: Router = express.Router();
router.post("/login", Login);

export default router;
