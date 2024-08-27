const Group = require("../model/groupModel");
const Chat = require('../model/chatModel');
const UserGroup = require("../model/userGroupModel");
const User = require("../model/adminModel");
const sequelize = require("../util/database");

// #region Create Group
exports.createGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { name, members } = req.body;

    const groupDetails = await Group.create(
      {
        name: name,
        admin: userId,
      },
      { transaction: t }
    );

    const memberEntries = members.map((memberId) => ({
      groupId: groupDetails.id,
      userId: memberId,
      isAdmin: memberId === userId,
    }));

    await UserGroup.bulkCreate(memberEntries, { transaction: t });

    await t.commit();
    res
      .status(200)
      .json({ success: true, message: "Successfully group created" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({
      success: false,
      error: "Something went wrong while creating group",
    });
  }
};
// #end region

// #region send group message
exports.sendGroupMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const senderId = req.user.id;
    const groupId = req.params.groupId;
    const content = req.body.content;

    const message = {
      senderId,
      content,
      groupId,
    };

    await Chat.create(message, { transaction: t });
    await t.commit();
    res.status(201).json({ message, success: true });
  } catch (error) {
    console.log({ error });
    await t.rollback();
    res
      .status(500)
      .json({ error: "Something went wrong while sending message" });
  }
};
// #end region