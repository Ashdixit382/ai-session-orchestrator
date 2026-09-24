import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messageSequence: {
      type: Number,
      default: 0,
    },
    processedSequence: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

conversationSchema.index({
  user: 1,
  updatedAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
