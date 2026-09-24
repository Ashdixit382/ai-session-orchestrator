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
    sequence: {
      type: Number,
      required: true,
    },
    replyToMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    aiStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

messageSchema.index(
  { replyToMessage: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: "assistant",
      replyToMessage: { $ne: null },
    },
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
