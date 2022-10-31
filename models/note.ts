import { model, Schema, Types } from "mongoose";

interface INote {
  title: string;
  content: string;
}

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Note = model<INote>("Note", noteSchema);

export default Note;
