const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authenticate');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);
router.get('/verify', userController.verifyEmail);
router.get('/signout', authenticate, userController.signOut);

//router.get('/profile', userController.getProfile);
//router.get('/:id', userController.getUserById);

module.exports = router;
