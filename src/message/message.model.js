import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
