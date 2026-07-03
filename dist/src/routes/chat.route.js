"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_model_1 = __importDefault(require("../model/chat.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Get all chat sessions (admin)
router.get("/sessions", auth_middleware_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessions = yield chat_model_1.default.find()
            .sort({ updatedAt: -1 })
            .select("sessionId visitorName visitorEmail visitorPhone status unreadCount messages updatedAt createdAt");
        return res.status(200).json({ status: "Success", data: sessions });
    }
    catch (_a) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
// Get a single session with full messages
router.get("/sessions/:sessionId", auth_middleware_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_model_1.default.findOne({ sessionId: req.params.sessionId });
        if (!chat)
            return res.status(404).json({ message: "Session not found" });
        return res.status(200).json({ status: "Success", data: chat });
    }
    catch (_b) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
