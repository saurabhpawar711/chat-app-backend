const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authorization");
const chatController = require("../controller/chatController");

router.post(
  "/api/messages",
  authenticateUser.authenticateUser,
  chatController.sendMessage
);

router.get(
  "/api/messages/history",
  authenticateUser.authenticateUser,
  chatController.getMessages
);

module.exports = router;
