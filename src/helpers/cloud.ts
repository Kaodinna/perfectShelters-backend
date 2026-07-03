import cloudinary from "cloudinary";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (path: string) => {
  try {
    return await cloudinary.v2.uploader.upload(path);
  } finally {
    fs.unlink(path).catch(() => {});
  }
};

export const uploadVideoToCloudinary = async (path: string) => {
  try {
    return await cloudinary.v2.uploader.upload(path, {
      resource_type: "video",
      folder: "perfect_shelters/videos",
    });
  } finally {
    fs.unlink(path).catch(() => {});
  }
};
