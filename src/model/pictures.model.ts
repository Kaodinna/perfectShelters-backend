import mongoose, { Document } from "mongoose";

export interface PicturesAttribute {
  picture: string;
  details: string;
}

export const pictureSchema = new mongoose.Schema<PicturesAttribute>(
  {
    picture: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pictures = mongoose.model<PicturesAttribute & Document>(
  "Pictures",
  pictureSchema
);
export default Pictures;
