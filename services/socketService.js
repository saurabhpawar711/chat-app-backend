const Chat = require("../model/chatModel");
const Admin = require("../model/adminModel");
const S3Services = require("../services/S3Service");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(4000, {
  cors: {
    origin: "*",
  },
});

exports.socketConnection = () => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("getDirectMessage", async (senderId, receiverId, page, pageSize) => {
      const offset = (page - 1) * pageSize;
      try {
        const messages = await Chat.findAll({
          attributes: ["id", "senderId", "receiverId", "content"],
          where: {
            receiverId,
            senderId,
          },
          limit: pageSize,
          offset
        });

        socket.emit("gotIndividualMessages", messages);
      } catch (error) {
        console.log(error);
        socket.emit("error", "Failed to get direct messages.");
      }
    });

    socket.on("joinGroup", (groupId, page, pageSize) => {
      socket.join(groupId);
    });

    socket.on("getGroupMessages", async (groupId) => {
      const offset = (page - 1) * pageSize;
      try {
        const messages = await Chat.findAll({
          attributes: ["id", "senderId", "groupId", "content"],
          where: { groupId },
          limit: pageSize,
          offset
        });

        io.to(groupId).emit("gotGroupMessages", messages);
      } catch (err) {
        console.log(err);
        socket.emit("error", "Failed to get group messages.");
      }
    });

    socket.on(
      "upload",
      async (file, fileExtension, groupId, fileType, token) => {
        const t = await sequelize.transaction();
        try {
          const userDetails = jwt.verify(token, process.env.JWT_SECRETKEY);
          const user = await Admin.findOne({
            where: { id: userDetails.userId },
          });

          const fileName = `chatAppFile${groupId}/${new Date().toISOString()}.${fileExtension}`;
          const fileUrl = await S3Services.uploadToS3(file, fileName, fileType);

          const newMessage = await Chat.create(
            {
              senderId: user.id,
              content: fileUrl,
              groupId: groupId,
            },
            { transaction: t }
          );

          await t.commit();

          const chatData = {
            id: newMessage.id,
            senderId: user.id,
            content: fileUrl,
          };

          io.to(groupId).emit("fileUrl", chatData); // Emit to the group room
        } catch (err) {
          await t.rollback();
          console.log(err);
          socket.emit("error", "Failed to upload file.");
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
