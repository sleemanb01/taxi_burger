import mongoose, { Types, Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IStock extends Document {
  _id?: Types.ObjectId;
  name: string;
  quantity: number;
  image?: string;
}

const stockSchema = new Schema<IStock>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: false },
});

export default mongoose.model<IStock>("Stock", stockSchema);
