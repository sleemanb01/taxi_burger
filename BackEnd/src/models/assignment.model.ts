import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  _id?: string;
  name: string;
  image?: string;
  description: string;
}

const AssignmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: true },
});

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
