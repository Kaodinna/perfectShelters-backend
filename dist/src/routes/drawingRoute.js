"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const drawingController_1 = require("../controllers/drawingController");
const router = express_1.default.Router();
router.post("/add-drawing", drawingController_1.AddDrawing);
router.get("/get-drawings", drawingController_1.getAllDrawings);
exports.default = router;
