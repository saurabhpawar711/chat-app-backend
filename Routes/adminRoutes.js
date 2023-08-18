const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController');

router.post('/user/signup', adminController.signUp);

module.exports = router;