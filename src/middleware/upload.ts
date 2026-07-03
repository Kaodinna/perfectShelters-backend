import multer from "multer";
import { Request, Response, NextFunction, RequestHandler } from "express";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const imageUpload = multer({
  dest: "../uploads",
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

const videoUpload = multer({
  dest: "../uploads",
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) return cb(null, true);
    cb(new Error("Only video files are allowed"));
  },
});

// multer surfaces file-filter/size errors via next(err) — wrap so the client
// gets a clean JSON response instead of Express's default HTML error page.
function withUploadErrorHandling(uploadFn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFn(req, res, (err: any) => {
      if (err) {
        const message =
          err.code === "LIMIT_FILE_SIZE" ? "File is too large" : err.message || "Upload failed";
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  };
}

// Middleware to get all uploaded files
export const uploadMiddleware = withUploadErrorHandling(imageUpload.any());
export const uploadVideoMiddleware = withUploadErrorHandling(videoUpload.any());
