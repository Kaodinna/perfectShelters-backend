import multer from "multer";

const upload = multer({
  dest: "../uploads",
});

// Middleware to get all uploaded files

export const uploadMiddleware = upload.any();
