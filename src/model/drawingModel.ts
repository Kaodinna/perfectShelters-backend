import mongoose, { Schema, Document } from "mongoose";

export interface DrawingAttribute {
  frontElevation: string;
  rightElevation: string;
  leftElevation: string;
  type: string;
  category: string;
  description: string;
  refNo: string;
  price: string;
  drawing_details: Array<{ floor: string; details: string }>;
  comments: Array<Schema.Types.ObjectId>;
}

export const drawingSchema = new mongoose.Schema<DrawingAttribute>(
  {
    frontElevation: {
      type: String,
      required: true,
    },
    rightElevation: {
      type: String,
      required: true,
    },
    leftElevation: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    refNo: {
      type: String,
      required: true,
    },
    price: {
      required: true,
      type: String,
    },
    drawing_details: [
      {
        floor: {
          type: String,
          required: true,
        },
        details: {
          type: String,
          required: true,
        },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Drawing = mongoose.model<DrawingAttribute>("drawing", drawingSchema);
export default Drawing;
