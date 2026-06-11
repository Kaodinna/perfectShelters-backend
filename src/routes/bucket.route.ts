import express from "express";
import { BucketController } from "../controllers/bucket.controller";
import { Response, Request } from "../interface/ExpressTypes";
import { uploadMiddleware } from "../middleware/upload";

const router = express.Router();

const Bucket = new BucketController();

router.get("/", (req: Request, res: Response) => {
  res.send(" Bucket Storage Endpoint is live");
});

router.post("/upload", uploadMiddleware, (req: Request, res: Response) => {
  Bucket.addToBucket(res, req.files);
});

router.post("/upload-video", uploadMiddleware, (req: Request, res: Response) => {
  Bucket.addVideoToBucket(res, req.files);
});

router.get("/download/:bucketId", (req: Request, res: Response) => {
  const bucketId = req.params.bucketId;
  Bucket.getBucket(res, bucketId);
});

export default router;
