import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICode extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
}

const CodeSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

export default mongoose.model<ICode>("Code", CodeSchema);
