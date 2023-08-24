const express = require('express');
const router = express.Router();

const authenticateUser = require('../middleware/authorization');
const groupController = require('../controller/groupController');

router.post('/group/create-group', authenticateUser.authenticateUser, groupController.createGroup);

router.get('/user/groups', authenticateUser.authenticateUser, groupController.getGroups);

router.post('/group/add-user', authenticateUser.authenticateUser, groupController.addUserinGroup);

router.get('/group/get-users/:id', authenticateUser.authenticateUser, groupController.getUsersOfGroup);

router.post('/group/make-admin', authenticateUser.authenticateUser, groupController.makeAdmin);

router.delete('/group/remove-user', authenticateUser.authenticateUser, groupController.removeUserFromUser);

router.post('/group/remove-admin', authenticateUser.authenticateUser, groupController.removeAsAdmin);

router.delete('/group/delete-group/:groupName', authenticateUser.authenticateUser, groupController.deleteGroup);

module.exports = router;