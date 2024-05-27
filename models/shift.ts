import { Schema, model, models } from "mongoose";
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
  }
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
const Shift = models.Shift || model("Shift", ShiftSchema);

export default Shift;
