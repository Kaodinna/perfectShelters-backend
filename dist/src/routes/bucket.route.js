"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bucket_controller_1 = require("../controllers/bucket.controller");
const upload_1 = require("../middleware/upload");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const Bucket = new bucket_controller_1.BucketController();
router.get("/", (req, res) => {
    res.send(" Bucket Storage Endpoint is live");
});
router.post("/upload", auth_middleware_1.requireAuth, upload_1.uploadMiddleware, (req, res) => {
    Bucket.addToBucket(res, req.files);
});
router.post("/upload-video", auth_middleware_1.requireAuth, upload_1.uploadVideoMiddleware, (req, res) => {
    Bucket.addVideoToBucket(res, req.files);
});
router.get("/download/:bucketId", (req, res) => {
    const bucketId = req.params.bucketId;
    Bucket.getBucket(res, bucketId);
});
exports.default = router;
