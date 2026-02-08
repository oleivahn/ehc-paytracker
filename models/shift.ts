import mongoose, { Schema, model, models } from "mongoose";
import { date } from "zod";

// - Define the schema for the Shift collection
const ShiftSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  shiftDate: {
    type: Date,
    default: Date.now,
  },
  easyDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  shiftType: {
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
  outOfState: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
const Shift = models.Shift || model("Shift", ShiftSchema);

export default Shift;
