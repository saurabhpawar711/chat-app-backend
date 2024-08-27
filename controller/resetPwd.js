const backendApi = process.env.HOST_URL;
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const User = require("../model/adminModel");
const ResetPassword = require("../model/resetPasswordModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.sendEmail = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const email = req.body.email;
    const id = uuidv4();

    const findEmail = await User.findOne({ where: { email: email } });
    if (!findEmail) {
      throw new Error("Enter registered email");
    }

    await ResetPassword.create(
      { id: id, isActive: true, userId: findEmail.id },
      { transaction: t }
    );

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: process.env.SENDER_EMAIL,
    };

    const receivers = [
      {
        email: email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "reset your password",
      htmlContent: `<h3>Chat App reset password</h3>
            <h4>You can reset your password by clicking below</h4>
            <a href="${backendApi}/password/checkRequest/${id}">Click here</a>`,
    });
    await t.commit();
    return res
      .status(200)
      .json({ message: "reset password link sent to your email" });
  } catch (err) {
    await t.rolllback();
    const errorMessage =
      err.message === "Enter registered email"
        ? err.message
        : "Error while sending email";
    res.status(500).json({ error: errorMessage });
  }
};

exports.checkRequest = async (req, res, next) => {
  try {
    const uuid = req.params.uuid;
    const isRequestActive = await ResetPassword.findOne({
      where: { id: uuid, isActive: true },
    });
    const userId = isRequestActive.userId;
    if (isRequestActive) {
      await ResetPassword.update({ isActive: false }, { where: { id: uuid } });
      res.redirect(
        `${backendApi}/ResetPassword/resetPassword.html?uI=${userId}&u=${uuid}`
      );
    } else {
      throw new Error("Link expired");
    }
  } catch (err) {
    console.log(err);
    if (err.message === "Link expired") {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updatePassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const newPassword = req.body.newPassword;
    const userId = req.params.userId;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.update(
      { password: hashedPassword },
      { where: { id: userId }, transaction: t }
    );
    await t.commit();
    res.status(200).json({
      success: true,
      message: "Yor have successfully changed your password",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(404).json({ error: "User not found" });
  }
};
