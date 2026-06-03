import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./src/routes/userRoute";
import drawingRouter from "./src/routes/drawingRoute";
import commentRouter from "./src/routes/commentRoute";
import cors from "cors";
import bucketRouter from "./src/routes/bucket.route";
import constructionRouter from "./src/routes/construction.route";
import pictureRouter from "./src/routes/picture.route";
import chatRouter from "./src/routes/chat.route";
import { registerChatHandlers } from "./src/socket/chat.socket";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 8080;

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://perfect-shelters.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  registerChatHandlers(io, socket);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Perfect Shelters API");
});

app.use("/users", userRouter);
app.use("/bucket", bucketRouter);
app.use("/drawing", drawingRouter);
app.use("/comment", commentRouter);
app.use("/construct", constructionRouter);
app.use("/picture", pictureRouter);
app.use("/chat", chatRouter);

const url = process.env.MONGO_URI!;

mongoose
  .connect(url, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    httpServer.listen(port, () => {
      console.log(`[server]: Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Fatal: could not connect to MongoDB", error);
    process.exit(1);
  });
