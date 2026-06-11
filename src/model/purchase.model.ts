import mongoose, { Schema } from "mongoose";

export interface PurchaseAttribute {
  transactionRef: string;
  planRef: string;
  planDescription: string;
  drawingId?: Schema.Types.ObjectId;
  email: string;
  name: string;
  amount: number;
  status: "success" | "failed";
  paystackData?: object;
}

const purchaseSchema = new mongoose.Schema<PurchaseAttribute>(
  {
    transactionRef: { type: String, required: true, unique: true },
    planRef: { type: String, required: true },
    planDescription: { type: String, default: "" },
    drawingId: { type: mongoose.Schema.Types.ObjectId, ref: "drawing" },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    paystackData: { type: Object },
  },
  { timestamps: true }
);

const Purchase = mongoose.model<PurchaseAttribute>("purchase", purchaseSchema);
export default Purchase;
