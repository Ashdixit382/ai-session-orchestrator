import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// A Mongoose model provides an interface to interact with
// the MongoDB collection using the defined schema.
// here User is a object which extends model and have function
// like User.find(),User.findOne() etc.

// mongoose.model(modelName, schema)
// modelName: Logical model name used by Mongoose.
// schema: Defines the structure and rules for documents.
// Mongoose automatically maps "User" to the "users"
// collection (pluralized and lowercased by default).

// collection is like a table and document is like a row.

const User = mongoose.model("User", userSchema);

export default User;
