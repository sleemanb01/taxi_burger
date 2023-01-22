import mongoose, { Types, Document } from "mongoose";

const Schema = mongoose.Schema;

export interface ICategory extends Document {
  _id?: Types.ObjectId;
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

export default mongoose.model<ICategory>("Category", categorySchema);
