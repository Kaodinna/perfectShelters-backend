import cloudinary from "cloudinary";

export const uploadToCloudinary = async (path: string) => {
  cloudinary.v2.config({
    cloud_name: "diwozc824",
    api_key: "867414457582548",
    api_secret: "kLJx16cFR-Yyc53QgwdyO_LY3YY",
  });
  return await cloudinary.v2.uploader.upload(path);
};
