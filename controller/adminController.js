const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const number = req.body.number;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = await Admin.create({ name: name, email: email, number: number, password: hashedPassword }, { transaction: t });
        await t.commit();
        res.status(201).json({ userDetails: data, success: true });

    }
    catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(400).json({ error: 'User already exists' });
    }
}

function generateToken(id) {
    return jwt.sign({ userId: id }, process.env.JWT_SECRETKEY);
}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Admin.findOne({ where: { email: email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        else {
            const name = user.name;
            const passwordMatched = await bcrypt.compare(password, user.password);
            if (passwordMatched) {
                res.status(201).json({ success: true, name: name, message: "User logged in successfully", token: generateToken(user.id) });
            }
            else {
                throw new Error('Invalid credentials');
            }
        }
    }
    catch (err) {
        console.log(err);
        if (err.message === "Invalid credentials") {
            res.status(404).json({ error: err.message, success: false });
        }
    }
}

