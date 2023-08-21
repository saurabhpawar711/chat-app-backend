const Chat = require('../model/chatModel');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const name = req.user.name;
        const message = req.body.message;

        const messageAdded = await Chat.create({
            name: name,
            message: message,
            userId: userId
        }, { transaction: t });

        const chatData = {
            id: messageAdded.id,
            name: name,
            message: message
        }
        await t.commit();
        res.status(201).json({ message: chatData, success: true });
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: "Something went wrong while sending message" });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const lastMsgId = req.query.id;
        let whereCondition = {};

        if(lastMsgId) {
            whereCondition = {
                id: {
                    [Op.gt]: lastMsgId
                }
            }
        }
        const messages = await Chat.findAll({
            attributes: ['id', 'name', 'message'],
            where: whereCondition
        });
        const totalMsgs = await Chat.count();
        res.status(200).json({ success: true, messages: messages, noOfMsgs: totalMsgs });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}