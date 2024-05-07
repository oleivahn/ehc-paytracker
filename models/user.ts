import { Schema, model, models } from "mongoose";

// Define the schema for the User collection
// Same as - Create the Users table
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// - THIS IS WHERE YOU DEFINE THE TABLE NAME FOR MONGO_DB
// model = table
// If models.User (on mongo) exists, use it, otherwise create a new model (or a "table")
const User = models.User || model("User", UserSchema);

export default User;
