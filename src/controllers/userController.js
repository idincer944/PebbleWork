const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validateUser} = require('../utils/validations');
const mailFunctions = require('../utils/mailing/mail-functions');
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
      const { username, password, rememberMe } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Wrong username or password' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Wrong username or password' });
      }

      const expiresIn = rememberMe ? '7d' : '2h';
      const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
        expiresIn,
      });
  
      // Save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      });

      // RESENDING THE LINK
      if (!user.is_verified) 
      {
          const link = `http://localhost:3000/user/verify`;
          mailFunctions.sendVerificationEmail(user.email, link,username);
          res.status(201).json({message:`Hello ${user.firstname}, apparently you have not verify your email yet! 🎉 Please check your email for the new verification link. 🌟`});
      }
     
       res.redirect('/events'); 
    } catch (err) {
      console.log(err);
    }
  },

  signUp: async (req, res) => {
    try {
      const validationResult = validateUser(req.body);

      if (validationResult.error) {
        // Validation failed, handle the error with custom messages
        const errorMessages = validationResult.error.details.map(
          (error) => error.message
        );
        return res.status(400).json({ errors: errorMessages });
      }
      const {
        firstname,
        lastname,
        username,
        password,
        password2,
        email,
        acceptTos,
        avatar,
      } = validationResult.value;

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

      const password_hash = await bcrypt.hash(password, 10);

      user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password_hash,
        avatar,
      });

      const expiresIn = rememberMe ? '7d' : '2h';
      const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
        expiresIn,
      });
  
      // Save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      });

      const link = `http://localhost:3000/user/verify`;
      mailFunctions.sendVerificationEmail(user.email, link,username);
    
      res.status(201).json({message:`Hello ${user.firstname}, Congratulations on successfully registering! 🎉 Please check your email for a verification link. 🌟`});
      
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

  getProfile: async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findById(decoded.user_id).select("fullName email username avatar -_id");
      return res.json(user);
    }
     catch (error) {
      res
      .status(500)
      .json(error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("fullName email username avatar -_id");
      res.status(200).json(user);
    } catch (error) {
      res
      .status(500)
      .json({ error: 'Internal Server Error while getting user' });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      // Getting the token from cookies because it is more secure this way.
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findByIdAndUpdate(decoded.user_id, {
        is_verified: true,
      });
      res.status(201).json({message:`Congratulations! ${user.firstname} 🎉 Your email has been successfully verified. Welcome to our community! 🌟`}); // we can add congratulations message here instead of json user with a timer. After a couple of seconds it can go to signin page.
    } catch (error) {
      res
      .status(500)
      .json(error);
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
