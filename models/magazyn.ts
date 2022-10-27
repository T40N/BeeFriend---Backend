import { model, Schema } from "mongoose";

interface IMagazyn {
  fodder: {
    name: string;
    opis: string;
    quantity: string;
  }[];
  tools: {
    name: string;
    opis: string;
    quantity: string;
  }[];
}

const magazynSchema = new Schema({
  fodder: [
    {
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
    },
  ],
  tools: [
    {
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
    },
  ],
});

const Magazyn = model<IMagazyn>("Magazyn", magazynSchema);

export default Magazyn;
