"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./src/routes/userRoute"));
const drawingRoute_1 = __importDefault(require("./src/routes/drawingRoute"));
const commentRoute_1 = __importDefault(require("./src/routes/commentRoute"));
const cors_1 = __importDefault(require("cors"));
const bucket_route_1 = __importDefault(require("./src/routes/bucket.route"));
const construction_route_1 = __importDefault(require("./src/routes/construction.route"));
const picture_route_1 = __importDefault(require("./src/routes/picture.route"));
const chat_route_1 = __importDefault(require("./src/routes/chat.route"));
const payment_route_1 = __importDefault(require("./src/routes/payment.route"));
const payment_controller_1 = require("./src/controllers/payment.controller");
const chat_socket_1 = require("./src/socket/chat.socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const port = process.env.PORT || 8080;
const allowedOrigins = [
    process.env.FRONTEND_URL || "https://perfect-shelters.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use((0, cors_1.default)(corsOptions));
// Webhook must receive the raw body for HMAC verification — register before express.json()
app.post("/payment/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.paystackWebhook);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
io.on("connection", (socket) => {
    (0, chat_socket_1.registerChatHandlers)(io, socket);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("Perfect Shelters API");
});
app.use("/users", userRoute_1.default);
app.use("/bucket", bucket_route_1.default);
app.use("/drawing", drawingRoute_1.default);
app.use("/comment", commentRoute_1.default);
app.use("/construct", construction_route_1.default);
app.use("/picture", picture_route_1.default);
app.use("/chat", chat_route_1.default);
app.use("/payment", payment_route_1.default);
const url = process.env.MONGO_URI;
mongoose_1.default
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
