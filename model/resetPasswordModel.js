const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const ResetPassword = sequelize.define('resetPassword', {
    id: {
        type: Sequelize.CHAR,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    isActive: Sequelize.BOOLEAN
});

module.exports = ResetPassword;