import mongoose, { Schema, model, models } from "mongoose";
import { date } from "zod";

// - Define the schema for the User collection
const ShiftSchema = new Schema({
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
  salary: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    required: true,
  },
  user: [
    {
      // Reference is the name of the model we are linking it to, this is the relationship
      item: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
const Shift = models.Shift || model("Shift", ShiftSchema);

export default Shift;
