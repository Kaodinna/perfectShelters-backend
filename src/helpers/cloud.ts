import cloudinary from "cloudinary";

export const uploadToCloudinary = async (path: string) => {
  cloudinary.v2.config({
    cloud_name: "dgugfsbon",
    api_key: "698253428546552",
    api_secret: "HFk6gq_M1Aw8_JPvbYNlycDp7IY",
  });
  return await cloudinary.v2.uploader.upload(path);
};
