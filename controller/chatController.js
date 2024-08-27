const Chat = require("../model/chatModel");
const sequelize = require("../util/database");
const UserGroup = require("../model/userGroupModel");

// #region Send Messages
exports.sendMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const senderId = req.user.id;
    const receiverId = req.body?.receiverId ?? null;
    const content = req.body.content;
    const groupId = req.body?.groupId ?? null;

    const message = {
      senderId,
      receiverId,
      content,
      groupId,
    };

    await Chat.create(message, { transaction: t });
    await t.commit();
    res.status(201).json({ message, success: true });
  } catch (err) {
    console.log({ err });
    await t.rollback();
    res
      .status(500)
      .json({ error: "Something went wrong while sending message" });
  }
};

// #region Get Messages
const groupMessagesByKey = (messages, key) => {
  return messages.reduce((acc, message) => {
    const messageKey = message[key];
    if (!acc[messageKey]) {
      acc[messageKey] = [];
    }
    acc[messageKey].push(message);
    return acc;
  }, {});
};

const getIndividualMessages = async (userId, withUserId, pageSize, offset) => {
  try {
    const options = {
      attributes: ["id", "receiverId", "content"],
      where: {
        senderId: userId,
        groupId: null,
      },
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
      raw: true,
    };
    if (withUserId) options.where.receiverId = withUserId;
    const messages = await Chat.findAll(options);
    return groupMessagesByKey(messages, "receiverId");
  } catch (error) {
    return {};
  }
};

const getGroupMessages = async (groupId, pageSize, offset) => {
  try {
    const options = {
      attributes: ["id", "groupId", "content"],
      where: {
        receiverId: null,
        groupId,
      },
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
      raw: true,
    };
    const messages = await Chat.findAll(options);
    return groupMessagesByKey(messages, "groupId");
  } catch (error) {
    return {};
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const withUserId = req.query?.withUserId;
    const groupId = req.query?.groupId;
    const page = req.query?.page ?? 1;
    const pageSize = req?.query?.pageSize ?? 10;
    const offset = (page - 1) * pageSize;

    if (withUserId && !groupId) {
      const individualMessages = await getIndividualMessages(
        userId,
        withUserId,
        pageSize,
        offset
      );
      return res.status(200).json({ individualMessages });
    }

    if (groupId && !withUserId) {
      const groupMessages = await getGroupMessages(groupId, pageSize, offset);
      return res.status(200).json({ groupMessages });
    }

    let groupsUserPresents = [];
    if (groupId) groupsUserPresents.push(groupId);
    else {
      groupsUserPresents = await UserGroup.findAll({
        attributes: ["groupId"],
        where: {
          userId,
        },
        raw: true,
      });
      groupsUserPresents.forEach((element, index, arr) => {
        arr[index] = element.groupId;
      });
    }

    const [individualMessages, groupMessages] = await Promise.all([
      getIndividualMessages(userId, withUserId, pageSize, offset),
      getGroupMessages(groupsUserPresents, pageSize, offset),
    ]);

    return res.status(200).json({
      individualMessages,
      groupMessages,
    });
  } catch (err) {
    console.log({ err });
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving messages." });
  }
};
// #end region
