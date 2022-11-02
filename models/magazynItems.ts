import { model, Schema } from "mongoose";

export interface IMagazynItems {
  name: string;
  opis: string;
  quantity: number;
}

const itemsSchema = new Schema({
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

export const Tools = model<IMagazynItems>("Tools", itemsSchema);
export const Fodder = model<IMagazynItems>("Fodder", itemsSchema);
