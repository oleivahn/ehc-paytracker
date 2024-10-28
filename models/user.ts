import mongoose, { Schema, model, models } from "mongoose";
import { date } from "zod";

// - Define the schema for the User collection
const UserSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
  },
  salary: {
    type: String,
    // required: true,
  },
  employeeType: {
    type: String,
    // required: true,
  },
  // shifts: [
  //   {
  //     // Reference is the name of the model we are linking it to, this is the relationship
  //     item: { type: mongoose.Schema.ObjectId, ref: "Shift" },
  //   },
  // ],
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
const User = models.User || model("User", UserSchema);

export default User;
