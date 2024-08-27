const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const sequelize = require("./util/database");

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

const User = require("./model/adminModel");
const Chat = require("./model/chatModel");
const Group = require("./model/groupModel");
const UserGroup = require("./model/userGroupModel");
const ResetPassword = require("./model/resetPasswordModel");

const adminRoute = require("./Routes/adminRoutes");
const chatRoute = require("./Routes/chatRoute");
const groupRoute = require("./Routes/groupRoute");
const passwordRoute = require("./Routes/resetPassword");

app.use(adminRoute);
app.use(chatRoute);
app.use(groupRoute);
app.use(passwordRoute);

// Association
User.hasMany(Chat, { onDelete: "CASCADE" });
Chat.belongsTo(User);
User.belongsToMany(Group, { through: UserGroup, onDelete: "CASCADE" });
Group.belongsToMany(User, { through: UserGroup });
Chat.belongsTo(Group, { onDelete: "CASCADE" });
Group.hasMany(Chat, { onDelete: "CASCADE" });
ResetPassword.belongsTo(User);

// for other req url which is not defined, redirect to specific url.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", `${req.url}`));
});

// Socket Connection
const { socketConnection } = require("./services/socketService");
socketConnection();

const port = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    console.log(`App listening to PORT ${port}`)
    app.listen(port);
  })
  .catch((err) => console.log(err));
