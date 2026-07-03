import mongoose, { Document } from "mongoose";

export interface PicturesAttribute {
  picture: string;
  details: string;
  drawingId: mongoose.Schema.Types.ObjectId;
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
    drawingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "construction",
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
