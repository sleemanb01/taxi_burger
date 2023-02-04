import mongoose, { Types, Document } from "mongoose";
import { ICategory } from "./category.model";

const Schema = mongoose.Schema;

export interface IStock extends Document {
  _id?: Types.ObjectId;
  categoryId: ICategory["_id"];
  name: string;
  quantity: number;
  inUse: boolean;
  image: string;
  minQuantity: number;
  maxQuantity: number;
}

const stockSchema = new Schema<IStock>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  quantity: { type: Number, required: true },
  inUse: { type: Boolean, required: true },
  image: { type: String, required: true },
  minQuantity: { type: Number, required: true },
  maxQuantity: { type: Number, required: true },
});

export default mongoose.model<IStock>("Stock", stockSchema);
