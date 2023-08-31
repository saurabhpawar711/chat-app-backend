const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('archivedchat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    }
});

module.exports = ArchivedChat;