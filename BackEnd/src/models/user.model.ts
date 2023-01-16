import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  isAdmin: boolean;
}

const MINLENGTH = 6;

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: MINLENGTH },
  image: { type: String, required: false },
  isAdmin: { type: Boolean, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
