import mongoose, { Schema, Document } from "mongoose";

export interface ConstructionAttribute {
  coverPhoto: string;
  title: string;
  description: string;
  location: string;
  status: "Ongoing" | "Completed";
  clientName: string;
  year: string;
  videos: string[];
  pictures: Array<Schema.Types.ObjectId>;
}

export const constructionSchema = new mongoose.Schema<ConstructionAttribute>(
  {
    coverPhoto: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    status: { type: String, enum: ["Ongoing", "Completed"], default: "Ongoing" },
    clientName: { type: String, default: "" },
    year: { type: String, default: "" },
    videos: [{ type: String }],
    pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pictures" }],
  },
  { timestamps: true }
);

const Construction = mongoose.model<ConstructionAttribute>("construction", constructionSchema);
export default Construction;
