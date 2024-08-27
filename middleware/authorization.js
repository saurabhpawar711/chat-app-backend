const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userDetails = jwt.verify(token, process.env.JWT_SECRETKEY);
    const user = await Admin.findOne({ where: { id: userDetails.userId } });
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error while authenticating user" });
  }
};
