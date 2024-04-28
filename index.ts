import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import userRouter from "./src/routes/userRoute";
import drawingRouter from "./src/routes/drawingRoute";
import commentRouter from "./src/routes/commentRoute";
import cors from "cors";
import bucketRouter from "./src/routes/bucket.route";
import constructionRouter from "./src/routes/construction.route";
import pictureRouter from "./src/routes/picture.route"

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = ["*"];
  const origin = req.headers.origin ?? "http://localhost";
  if (allowedOrigins.includes(origin))
    res.setHeader("Access-Control-Allow-Origin", origin);

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});
app.use(cors());

const url = `mongodb+srv://perfectshelterng:chibuike123@cluster0.8avq6xm.mongodb.net/`;
// const url = `mongodb+srv://kaodi-investment:houseparty22@cluster0.nzmmrt4.mongodb.net/`

mongoose
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

app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});

app.use("/users", userRouter);
app.use("/bucket", bucketRouter);
app.use("/drawing", drawingRouter);
app.use("/comment", commentRouter);
app.use("/construct", constructionRouter);
app.use("/picture", pictureRouter);
