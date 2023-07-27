const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getAllUsers', authenticate(), userController.getAllUsers);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.delete('/deleteUser/:id', authenticate(), userController.deleteUser);
router.get('/verify/:token', userController.verifyEmail);
router.get('/signout', authenticate(), userController.signOut);
router.get('/signup', userController.renderSignUpPage);
router.get('/signin', userController.renderSignInPage);

module.exports = router;
