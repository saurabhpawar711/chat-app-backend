const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserGroup = sequelize.define('userGroup', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = UserGroup;