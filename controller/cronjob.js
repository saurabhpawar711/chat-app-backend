const Chat = require('../model/chatModel');
const ArchivedChat = require('../model/archivedChatsModel');
const { CronJob } = require('cron');
const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const cronjob = new CronJob('0 0 * * *', async () => {
    const t = await sequelize.transaction();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
        const previousChat = await Chat.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lte]: yesterday
                }
            }
        });
        console.log(previousChat);

        const previousChatData = previousChat.map(chatInstance => chatInstance.dataValues);
        await ArchivedChat.bulkCreate(previousChatData, { transaction: t });
        await Chat.destroy({
            where: {
                createdAt: {
                    [Sequelize.Op.lte]: yesterday
                }
            }, transaction: t
        })
        await t.commit();
        console.log('Cron operation done successfully');
    }

    catch (err) {
        await t.rollback();
        console.log(err);
    }
});

module.exports = cronjob;