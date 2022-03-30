const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/sign-up', authController.signupForm);
router.post('/sign-up', authController.signupUser);
router.get('/logout', authController.logout);
router.get('/login', authController.loginForm);
router.post('/login', authController.login);
module.exports = router;
