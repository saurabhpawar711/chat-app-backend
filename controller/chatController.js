const Chat = require('../model/chatModel');
const Admin = require('../model/adminModel');
const sequelize = require('../util/database');
const S3Services = require('../services/S3Service');
const jwt = require('jsonwebtoken');
const io = require('socket.io')(4000, {
    cors: {
        origin: '*',
    }
})

exports.sendMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const name = req.user.name;
        const message = req.body.message;
        const groupId = req.body.groupId;

        if(groupId === null) {
            throw new Error('Please select group');
        }

        const messageAdded = await Chat.create({
            name,
            message,
            userId,
            groupId
        }, { transaction: t });

        const chatData = {
            id: messageAdded.id,
            name,
            message
        }
        await t.commit();
        res.status(201).json({ message: chatData, success: true });
    }
    catch (err) {
        await t.rollback();
        if(err.message === 'Please select group') {
            return res.status(500).json({ error: err.message });
        }
        res.status(500).json({ error: "Something went wrong while sending message" });
    }
}

io.on('connection', (socket) => {
    console.log('Connected');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
    });

    socket.on('getMessages', async (groupId) => {
        try {
            const messages = await Chat.findAll({
                attributes: ['id', 'name', 'message'],
                where: {
                    groupId: groupId
                }
            });
            io.to(groupId).emit('gotMessages', messages);
        }
        catch (err) {
            socket.on('connect_error', err => {
                console.log(err);
            })
        }
    })

    socket.on('upload', async (file, fileExtension, groupId, fileType, token) => {
        const t = await sequelize.transaction();
        try {
            const userDetails = jwt.verify(token, process.env.JWT_SECRETKEY);
            const user = await Admin.findOne({
                where: {
                    id: userDetails.userId
                }
            });
            const userId = user.id;
            const userName = user.name;
            const fileName = `chatAppFile${groupId}/${new Date()}.${fileExtension}`;
            const fileUrl = await S3Services.uploadToS3(file, fileName, fileType);
            const newMessage = await Chat.create({
                name: userName,
                message: fileUrl,
                userId: userId,
                groupId: groupId
            }, { transaction: t });

            const chatData = {
                id: newMessage.id,
                name: userName,
                message: fileUrl
            }

            await t.commit();
            io.emit('fileUrl', chatData);
        }
        catch (err) {
            await t.rollback();
            console.log(err);
            socket.on('connect_error', err => {
                console.log(err);
            })
        }
    })
})

