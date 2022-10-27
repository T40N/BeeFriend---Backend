import { model, Schema } from "mongoose";

interface IEvent {
  date: Date;
  name: string;
  opis: string;
}

const eventSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  opis: {
    type: String,
    require: true,
  },
});

const Event = model<IEvent>("Event", eventSchema);

export default Event;
