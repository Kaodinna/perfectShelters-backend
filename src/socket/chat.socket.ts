import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "../model/chat.model";
import { sendEmail, chatNotificationHtml } from "../utils/notification";
import { ADMIN_EMAIL, FRONTEND_URL, JWT_KEY } from "../config/db.config";

function isValidAdminToken(token: unknown): boolean {
  if (typeof token !== "string" || !token) return false;
  try {
    jwt.verify(token, `${JWT_KEY}verifyThisaccount`);
    return true;
  } catch {
    return false;
  }
}

export function registerChatHandlers(io: Server, socket: Socket) {
  // Set only after a valid admin JWT is presented via admin:join / admin:open_session / chat:close.
  let isAdmin = false;

  // Visitor starts or resumes a chat session
  socket.on("chat:start", async ({ sessionId, visitorName, visitorEmail, visitorPhone }) => {
    try {
      let chat = await Chat.findOne({ sessionId });
      const isNew = !chat;
      if (!chat) {
        chat = await Chat.create({ sessionId, visitorName, visitorEmail, visitorPhone });
        // Fire-and-forget — don't block the socket response
        const adminChatUrl = `${FRONTEND_URL || "https://perfect-shelters.vercel.app"}/admin-chats`;
        sendEmail(
          ADMIN_EMAIL,
          `💬 New chat from ${visitorName}`,
          chatNotificationHtml(visitorName, visitorPhone, adminChatUrl)
        );
      }
      socket.join(sessionId);
      socket.emit("chat:history", chat.messages);
      // Notify admin room of new session
      io.to("admin").emit("chat:new_session", {
        sessionId,
        visitorName: chat.visitorName,
        lastMessage: chat.messages[chat.messages.length - 1] ?? null,
        unreadCount: chat.unreadCount,
        status: chat.status,
        createdAt: chat.createdAt,
      });
    } catch (err) {
      socket.emit("chat:error", "Could not start chat session");
    }
  });

  // Visitor or admin sends a message
  socket.on("chat:message", async ({ sessionId, text, sender }) => {
    // A socket may only post into a session room it has actually joined
    // (visitor via chat:start, admin via admin:open_session).
    if (!socket.rooms.has(sessionId)) return;
    // Never trust the client's claimed sender — only a socket that authenticated
    // as admin (via admin:join/admin:open_session) may post as "admin".
    const actualSender: "visitor" | "admin" = isAdmin && sender === "admin" ? "admin" : "visitor";

    try {
      const msg = { sender: actualSender, text, timestamp: new Date(), read: false };
      const chat = await Chat.findOneAndUpdate(
        { sessionId },
        {
          $push: { messages: msg },
          $inc: { unreadCount: actualSender === "visitor" ? 1 : 0 },
        },
        { new: true }
      );
      if (!chat) return;

      // Broadcast to both visitor and any admin watching this session
      io.to(sessionId).emit("chat:message", msg);

      // Update admin session list
      io.to("admin").emit("chat:session_update", {
        sessionId,
        visitorName: chat.visitorName,
        lastMessage: msg,
        unreadCount: chat.unreadCount,
        status: chat.status,
        createdAt: chat.createdAt,
      });
    } catch (err) {
      socket.emit("chat:error", "Message failed to send");
    }
  });

  // Admin joins the admin room to receive all session events — requires a valid login JWT
  socket.on("admin:join", ({ token }: { token?: string } = {}) => {
    if (!isValidAdminToken(token)) {
      socket.emit("chat:error", "Unauthorized");
      return;
    }
    isAdmin = true;
    socket.join("admin");
  });

  // Admin opens a specific session — mark messages as read — requires a valid login JWT
  socket.on("admin:open_session", async ({ sessionId, token }: { sessionId: string; token?: string }) => {
    if (!isAdmin && !isValidAdminToken(token)) {
      socket.emit("chat:error", "Unauthorized");
      return;
    }
    isAdmin = true;
    socket.join(sessionId);
    await Chat.updateOne(
      { sessionId },
      { $set: { "messages.$[elem].read": true, unreadCount: 0 } },
      { arrayFilters: [{ "elem.sender": "visitor" }] }
    );
    const chat = await Chat.findOne({ sessionId });
    if (chat) socket.emit("chat:history", chat.messages);
  });

  // Typing indicator
  socket.on("chat:typing", ({ sessionId, sender }) => {
    const actualSender: "visitor" | "admin" = isAdmin && sender === "admin" ? "admin" : "visitor";
    socket.to(sessionId).emit("chat:typing", { sender: actualSender });
  });

  // Close a session — requires a valid login JWT
  socket.on("chat:close", async ({ sessionId, token }: { sessionId: string; token?: string }) => {
    if (!isAdmin && !isValidAdminToken(token)) {
      socket.emit("chat:error", "Unauthorized");
      return;
    }
    isAdmin = true;
    await Chat.updateOne({ sessionId }, { status: "closed" });
    io.to(sessionId).emit("chat:closed");
    io.to("admin").emit("chat:session_update", { sessionId, status: "closed" });
  });
}
