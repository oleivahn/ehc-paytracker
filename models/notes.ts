import { Schema, model, models } from "mongoose";

// Define the schema for the Note collection
// Same as - Create the Notes table
const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    // - Connect this table to the User table
    type: Schema.Types.ObjectId, // This is a reference to another table
    ref: "User", // This is the table name
  },
});

// THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
// model = table
// If models.User (on mongo) exists, use it, otherwise create a new model (or a "table")
const Note = models.Note || model("Note", NoteSchema);

export default Note;
