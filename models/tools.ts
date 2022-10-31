import { model, Schema } from "mongoose";

interface ITools {
  name: string;
  opis: string;
  quantity: number;
}

const toolsSchema = new Schema({
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

const Tools = model<ITools>("Tools", toolsSchema);

export default Tools;
