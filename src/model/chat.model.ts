import mongoose from "mongoose";

export interface IMessage {
  sender: "visitor" | "admin";
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface IChat {
  sessionId: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  messages: IMessage[];
  status: "active" | "closed";
  unreadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  sender: { type: String, enum: ["visitor", "admin"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const chatSchema = new mongoose.Schema<IChat>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    visitorName: { type: String, default: "Visitor" },
    visitorEmail: { type: String },
    visitorPhone: { type: String },
    messages: [messageSchema],
    status: { type: String, enum: ["active", "closed"], default: "active" },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
