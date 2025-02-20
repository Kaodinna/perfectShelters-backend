"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const drawingController_1 = require("../controllers/drawingController");
const router = express_1.default.Router();
router.post("/add-drawing", drawingController_1.AddDrawing);
router.post("/edit-drawing/:id", drawingController_1.editDrawing);
router.delete("/delete-drawing/:id", drawingController_1.deleteDrawing);
router.get("/get-drawings", drawingController_1.getAllDrawings);
router.get("/get-drawings/:id", drawingController_1.getDrawingById);
router.get("/search-drawings/:type?/:category?", drawingController_1.getDrawingsByParams);
exports.default = router;
