const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authorization");
const groupController = require("../controller/groupController");

router.post(
  "/api/groups",
  authenticateUser.authenticateUser,
  groupController.createGroup
);

router.post(
  "/api/groups/:groupId/messages",
  authenticateUser.authenticateUser,
  groupController.sendGroupMessage
);

module.exports = router;
