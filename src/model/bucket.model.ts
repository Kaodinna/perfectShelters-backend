import { Schema, model } from "mongoose";
import { IBucket } from "../interface/Bucket";

const BucketModal = new Schema<IBucket>(
  {
    url: { type: String, required: true },
    data: Object,
  },
  {
    timestamps: true,
  }
);

export const Bucket = model<IBucket>("Bucket", BucketModal);
