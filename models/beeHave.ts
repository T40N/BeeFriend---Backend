import { model, Schema, Types } from "mongoose";

interface IBeeHave {
  name: string;
  honeyTakenAll: number;
  waxTakenAll: number;
  notes?: Types.ObjectId[];
  history?: {
    date: Date;
    honeyTaken: number;
    waxTaken: number;
  }[];
}

const beeHaveSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  honeyTakenAll: {
    type: Number,
    required: true,
  },
  waxTakenAll: {
    type: Number,
    required: true,
  },
  notes: [{ type: Types.ObjectId, ref: "Note" }],
  history: [
    {
      date: {
        type: Date,
        required: true,
      },
      honeyTaken: {
        type: Number,
        required: true,
      },
      waxTaken: {
        type: Number,
        required: true,
      },
    },
  ],
});

const BeeHave = model<IBeeHave>("BeeHave", beeHaveSchema);

export default BeeHave;
