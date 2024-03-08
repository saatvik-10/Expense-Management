const express = require('express');
const { loginCon, registerCon } = require('../controllers/userCon');

// router obj
const router = express.Router();

// routers
router.post('/login', loginCon);

// Post || login
router.post('./login', loginCon);

// Post || Register
router.post('/register', registerCon);

module.exports = router;
