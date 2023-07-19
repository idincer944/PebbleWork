const User = require('../models/user');
const bcrypt = require('bcrypt');
const EmailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mail');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while getting users' });
    }
  },

  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Wrong username or password' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Wrong username or password' });
      }

      if (!user.is_verified) {
        return res.send('Please verify your email address'); // ask about this !!!!!
      }

      // create token
      const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: '2h',
      });
      // save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      });
      res.status(200).json(user);
      // res.redirect('/'); // !!!home page or profile page needs to be decided!!!
    } catch (err) {
      console.log(err);
    }
  },

  signUp: async (req, res) => {
    try {
      const {
        firstname,
        lastname,
        username,
        password,
        password2,
        email,
        acceptTos,
        avatar,
      } = req.body;

      if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' }); //change json to render and add the route
      }

      if (!acceptTos) {
        return res
          .status(400)
          .json({ error: 'You must accept the Terms of Service' }); //change json to render and add the route
      }

      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ error: 'Username already exists' }); //change json to render and add the route
      }

      if (EmailValidator.validate(email) === false) {
        return res.status(400).json({ error: 'Invalid email' }); //change json to render and add the route
      }

      const password_hash = await bcrypt.hash(password, 10);

      user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password_hash,
        avatar,
      });
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );
      // save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      });
      const link = `http://localhost:3000/user/verify`;
      sendMail(user.email, link);

      res.status(201).json(user);
      // res.redirect('/'); // !!!home page or profile page needs to be decided!!!
    } catch (err) {
      console.log(err);
    }
  },

  signOut: async (req, res) => {
    try {
      // Clear the token from the cookie
      res.clearCookie('token');

      // Redirect the user to the home page
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  },

  renderSignUpPage: (req, res) => {
    res.send('Hello, sign up');
  },
  renderSignInPage: (req, res) => {
    res.send('Hello, sign in');
  },
  renderVerifyPage: (req, res) => {
    res.send('Welcome! You are verified!');
  },

  verifyEmail: async (req, res, next) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findByIdAndUpdate(decoded.user_id, {
        is_verified: true,
      });
      res.status(201).json(user); // we can add congratulations message here instead of json user with a timer. After a couple of seconds it can go to signin page.
    } catch (error) {
      res.json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);
      res.status(200).json(`User ${user.username} deleted`);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while deleting user' });
    }
  },
};
