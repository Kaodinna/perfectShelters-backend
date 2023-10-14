import mongoose from "mongoose";

export interface DrawingAttribute {
  _id?: any;
  frontElevation: string;
  rightElevation: string;
  leftElevation: string;
  type: string;
  category: string;
  description: string;
  refNo: string;
  price: string;
  floor: string;
  details: string;
}

export const drawingSchema = new mongoose.Schema<DrawingAttribute>(
  {
    frontElevation: {
      type: String,
      rquired: true,
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
    floor: {
      required: true,
      type: String,
    },
    details: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

const Drawing = mongoose.model<DrawingAttribute>("drawing", drawingSchema);
export default Drawing;
