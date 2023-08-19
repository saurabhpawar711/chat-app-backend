const Chat = require('../model/chatModel');
const sequelize = require('../util/database');

exports.sendMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const name = req.user.name;
        const message = req.body.message;

        await Chat.create({
            name: name,
            message: message,
            userId: userId
        }, {transaction: t});
        
        const chatData = {
            name: name,
            message: message
        }
        await t.commit();
        res.status(201).json({message: "message sent!", message: chatData, success: true});
    }
    catch(err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({error: "Something went wrong while sending message"});
    }
}

exports.getMessages = async (req, res) => {
    try {
        const messages = await Chat.findAll({
            attributes: ['name', 'message']
        });
        res.status(200).json({success: true, messages: messages});
    }
    catch(err) {
        res.status(500).json({error: "Something went wrong"});
    }
}