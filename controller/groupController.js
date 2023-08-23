const Group = require('../model/groupModel');
const UserGroup = require('../model/userGroupModel');
const User = require('../model/adminModel');
const Chat = require('../model/chatModel');
const sequelize = require('../util/database');

exports.createGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const name = req.body.name;
        const userToBeAdd = req.body.userToBeAdd;

        const details = await Group.create({
            name: name,
            admin: userId
        }, { transaction: t });

        const userIdArray = [];
        for (let i = 0; i < userToBeAdd.length; i++) {
            const idOfUserToBeAdd = await User.findOne({
                attributes: ['id'],
                where: {
                    email: userToBeAdd[i]
                }
            })
            userIdArray.push(idOfUserToBeAdd.id);
        }

        for (let i = 0; i < userIdArray.length; i++) {
            await UserGroup.create({
                groupId: details.id,
                userId: userIdArray[i]
            }, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ success: true, message: "successful" });
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ success: false });
    }
}

exports.getGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupIds = await UserGroup.findAll({
            attributes: ['groupId'],
            where: {
                userId: userId
            }
        });

        const groupNames = [];
        for (let element of groupIds) {
            const groupDetails = await Group.findOne({
                attributes: ['name'],
                where: {
                    id: element.groupId
                }
            });
            groupNames.push(groupDetails.name);
        };

        res.status(200).json({ success: true, groupDetails: groupNames, groupIds: groupIds });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.addUserinGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        const adminUserId = req.user.id;


        const name = req.body.name;
        const userToBeAdd = req.body.userToBeAdd;


        const groupId = await Group.findOne({
            attributes: ['id', 'admin'],
            where: {
                name: name
            }
        });

        if (groupId.admin != adminUserId) {
            throw new Error('Only Admin has Access');
        }

        else {
            const userId = await User.findOne({
                attributes: ['id'],
                where: {
                    email: userToBeAdd
                }
            })

            await UserGroup.create({
                userId: userId.id,
                groupId: groupId.id
            }, { transaction: t });

            await t.commit();
            res.status(200).json({ success: true, message: "User added successfully" });
        }
    }
    catch (err) {
        console.log(err);
        if(err.message === 'Only Admin has Access') {
            await t.rollback();
            return res.status(500).json({error: err.message});
        }
        await t.rollback();
        res.status(500).json({ success: false });
    }
}
