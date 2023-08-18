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

const adminRoute = require('./Routes/adminRoutes');

app.use(adminRoute);

const port = 3000;
sequelize.sync()
    .then(result => {
        app.listen(port);
    })
    .catch(err => console.log(err));