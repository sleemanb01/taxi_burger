import mongoose, { Types, Document } from "mongoose";
import { ICategory } from "./category.model";

const Schema = mongoose.Schema;

export interface IStock extends Document {
  _id?: Types.ObjectId;
  categoryId: ICategory["_id"];
  name: string;
  quantity: number;
  image: string;
  minQuantity: number;
}

const stockSchema = new Schema<IStock>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  minQuantity: { type: Number, required: true },
});

export default mongoose.model<IStock>("Stock", stockSchema);
