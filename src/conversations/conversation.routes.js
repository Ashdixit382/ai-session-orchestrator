import { Router } from "express";
import {
  createConversationController,
  getConversationsController,
  getConversationController,
  updateConversationController,
  deleteConversationController,
} from "./conversation.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validate.middleware.js";
import { createConversationSchema, updateConversationSchema } from "./conversation.validation.js";
import { createMessageSchema, updateMessageSchema } from "../message/message.validation.js";
import {
  createMessageController,
  getMessageController,
  updateMessageController,
  sendMessageController,
} from "../message/message.controller.js";

const router = Router();

router.post(
  "/",
  authorizeUser,
  validate(createConversationSchema),
  asyncHandler(createConversationController),
);

router.get("/", authorizeUser, asyncHandler(getConversationsController));
router.get("/:conversationId", authorizeUser, asyncHandler(getConversationController));
router.patch(
  "/:conversationId",
  authorizeUser,
  validate(updateConversationSchema),
  asyncHandler(updateConversationController),
);

router.delete("/:conversationId", authorizeUser, asyncHandler(deleteConversationController));
router.post(
  "/:conversationId/messages",
  authorizeUser,
  validate(createMessageSchema),
  asyncHandler(sendMessageController),
);

router.get("/:conversationId/messages", authorizeUser, asyncHandler(getMessageController));
router.patch(
  "/:conversationId/messages/:messageId",
  authorizeUser,
  validate(updateMessageSchema),
  asyncHandler(updateMessageController),
);

export default router;
