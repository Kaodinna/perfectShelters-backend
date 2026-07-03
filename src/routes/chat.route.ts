import express from "express";
import Chat from "../model/chat.model";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

// Get all chat sessions (admin)
router.get("/sessions", requireAuth, async (req, res) => {
  try {
    const sessions = await Chat.find()
      .sort({ updatedAt: -1 })
      .select("sessionId visitorName visitorEmail visitorPhone status unreadCount messages updatedAt createdAt");
    return res.status(200).json({ status: "Success", data: sessions });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a single session with full messages
router.get("/sessions/:sessionId", requireAuth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId });
    if (!chat) return res.status(404).json({ message: "Session not found" });
    return res.status(200).json({ status: "Success", data: chat });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
