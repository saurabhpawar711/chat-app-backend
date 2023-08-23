const express = require('express');
const router = express.Router();

const authenticateUser = require('../middleware/authorization');
const groupController = require('../controller/groupController');

router.post('/group/create-group', authenticateUser.authenticateUser, groupController.createGroup);

router.get('/user/groups', authenticateUser.authenticateUser, groupController.getGroups);

router.post('/group/add-user', authenticateUser.authenticateUser, groupController.addUserinGroup);

module.exports = router;