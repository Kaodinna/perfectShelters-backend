"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const picture_controller_1 = require("../controllers/picture.controller");
const router = express_1.default.Router();
router.post("/add-picture", picture_controller_1.AddPicture);
exports.default = router;
