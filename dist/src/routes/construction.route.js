"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const construction_controller_1 = require("../controllers/construction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/add-construction", auth_middleware_1.requireAuth, construction_controller_1.AddConstruction);
router.put("/update-construction/:id", auth_middleware_1.requireAuth, construction_controller_1.updateConstruction);
router.get("/get-all-construction", construction_controller_1.getAllConstructions);
router.delete("/delete-construction/:id", auth_middleware_1.requireAuth, construction_controller_1.deleteConstruct);
router.get("/get-construction/:id", construction_controller_1.getConstructById);
exports.default = router;
