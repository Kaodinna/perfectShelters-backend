"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoMiddleware = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const imageUpload = (0, multer_1.default)({
    dest: "../uploads",
    limits: { fileSize: MAX_IMAGE_SIZE },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/"))
            return cb(null, true);
        cb(new Error("Only image files are allowed"));
    },
});
const videoUpload = (0, multer_1.default)({
    dest: "../uploads",
    limits: { fileSize: MAX_VIDEO_SIZE },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/"))
            return cb(null, true);
        cb(new Error("Only video files are allowed"));
    },
});
// multer surfaces file-filter/size errors via next(err) — wrap so the client
// gets a clean JSON response instead of Express's default HTML error page.
function withUploadErrorHandling(uploadFn) {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (err) {
                const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large" : err.message || "Upload failed";
                return res.status(400).json({ success: false, message });
            }
            next();
        });
    };
}
// Middleware to get all uploaded files
exports.uploadMiddleware = withUploadErrorHandling(imageUpload.any());
exports.uploadVideoMiddleware = withUploadErrorHandling(videoUpload.any());
