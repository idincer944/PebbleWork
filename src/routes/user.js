const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getAllUsers', userController.getAllUsers);


router.post('/signin', userController.signIn);

router.post('/signup', userController.signUp);

// router.get('/signout', authenticate, userController.signOut);

// router.get('/signup', userController.renderSignUpPage);

// router.get('/signin', userController.renderSignInPage);

module.exports = router;
/*
router.get('/signout', authenticate, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//jsons sign up page
router.get('/signup', (req, res) => {
  if (!req.session?.user)
    res.json('user/signup'); //change json to render and add the route
  else res.redirect('/');
});

// jsons sign in page
router.get('/signin', (req, res) => {
  if (!req.session?.user)
    res.json('user/signin'); //change json to render and add the route
  else res.redirect('/');
});
*/
