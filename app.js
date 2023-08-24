const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const sequelize = require('./util/database');

app.use(
    cors({
      origin: "*"
    })
  );
app.use(bodyParser.json({ extended: false }));

const User = require('./model/adminModel');
const Chat = require('./model/chatModel');
const Group = require('./model/groupModel');
const UserGroup = require('./model/userGroupModel');

const adminRoute = require('./Routes/adminRoutes');
const chatRoute = require('./Routes/chatRoute');
const groupRoute = require('./Routes/groupRoute');

app.use(adminRoute);
app.use(chatRoute);
app.use(groupRoute);

User.hasMany(Chat, { onDelete: 'CASCADE' });
Chat.belongsTo(User);
User.belongsToMany(Group, {through: UserGroup, onDelete: 'CASCADE'});
Group.belongsToMany(User, {through: UserGroup});
Chat.belongsTo(Group, { onDelete: 'CASCADE' });
Group.hasMany(Chat, { onDelete: 'CASCADE' });

const port = 3000;
sequelize.sync()
    .then(() => {
        app.listen(port);
    })
    .catch(err => console.log(err));