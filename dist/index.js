"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./src/routes/userRoute"));
const drawingRoute_1 = __importDefault(require("./src/routes/drawingRoute"));
const cors_1 = __importDefault(require("cors"));
const bucket_route_1 = __importDefault(require("./src/routes/bucket.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
const url = `mongodb+srv://perfectshelterng:chibuike123@cluster0.8avq6xm.mongodb.net/`;
// const url = `mongodb+srv://kaodi-investment:houseparty22@cluster0.nzmmrt4.mongodb.net/`
mongoose_1.default
    .connect(url, {
    retryWrites: true,
    w: "majority",
})
    .then(() => {
    console.log("connected to Mongo");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB");
    console.log(error);
});
app.use(express_1.default.json()); // Parse JSON data
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at ${port}`);
});
app.use("/users", userRoute_1.default);
app.use("/bucket", bucket_route_1.default);
app.use("/drawing", drawingRoute_1.default);
