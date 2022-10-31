import { model, Schema, Types } from "mongoose";

interface IFodder {
  name: string;
  opis: string;
  quantity: number;
}

const fodderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  opis: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Fodder = model<IFodder>("Fodder", fodderSchema);

export default Fodder;
