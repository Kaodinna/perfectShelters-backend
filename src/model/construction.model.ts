import mongoose, { Schema, Document } from "mongoose";

export interface ConstructionAttribute {
  coverPhoto: string;
  title: string;
  pictures: Array<Schema.Types.ObjectId>;
}

export const constructionSchema = new mongoose.Schema<ConstructionAttribute>(
  {
    coverPhoto: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pictures" }],
  },
  { timestamps: true }
);

const Construction = mongoose.model<ConstructionAttribute>(
  "construction",
  constructionSchema
);
export default Construction;
