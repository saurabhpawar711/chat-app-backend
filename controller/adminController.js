const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

exports.signUp = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const number = req.body.number;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = await Admin.create({ name: name, email: email, number: number,password: hashedPassword }, {transaction: t});
        await t.commit();
        res.status(201).json({userDetails: data, success: true});
        
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(400).json({ error: 'User already exists' });
    }
}
