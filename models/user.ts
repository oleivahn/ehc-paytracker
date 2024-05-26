import { Schema, model, models } from "mongoose";
import { date } from "zod";

// - Define the schema for the User collection
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shiftDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
const User = models.User || model("User", UserSchema);

export default User;
