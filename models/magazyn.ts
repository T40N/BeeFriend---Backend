import { model, Schema, Types } from "mongoose";

export interface IMagazyn {
  fodder: Types.ObjectId[];
  tools: Types.ObjectId[];
}

const magazynSchema = new Schema({
  fodder: [{ type: Types.ObjectId, ref: "Fodder" }],
  tools: [{ type: Types.ObjectId, ref: "Tools" }],
});

const Magazyn = model<IMagazyn>("Magazyn", magazynSchema);

export default Magazyn;
