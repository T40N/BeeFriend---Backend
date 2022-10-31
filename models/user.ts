import { model, Schema, Types } from "mongoose";

export interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  beeGarden?: {
    xCordinate: number;
    yCordinate: number;
    beeHaves: Types.ObjectId[];
  };
  calendar: Types.ObjectId[];
  magazyn: Types.ObjectId;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  beeGarden: {
    xCordinate: {
      type: Number,
    },
    yCordinate: {
      type: Number,
    },
    beeHaves: [{ type: Types.ObjectId, ref: "BeeHave" }],
  },
  calendar: [{ type: Types.ObjectId, ref: "Event" }],
  magazyn: { type: Types.ObjectId, ref: "Magazyn" },
});

const User = model<IUser>("User", userSchema);

export default User;
