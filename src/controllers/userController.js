const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validateUser } = require('../utils/validations');
const mailFunctions = require('../utils/mailing/mail-functions');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal Server Error while getting users' });
    }
  },

  signIn: async (req, res) => {
    try {
      const { username, password, rememberMe } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Wrong username or password' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Wrong password or password' });
      }

      const expiresIn = rememberMe ? '7d' : '2h';
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn,
        }
      );

      // Save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      });

      // RESENDING THE LINK
      if (!user.is_verified) {
        const link = `http://localhost:3000/user/verify`;
        mailFunctions.sendVerificationEmail(user.email, link, username);
        return res
          .status(201)
          .json({
            message: `Hello ${user.firstname}, apparently you have not verify your email yet! 🎉 Please check your email for the new verification link. 🌟`,
          });
      }
      return res.status(200).json({
        message: `Hello ${user.firstname}, you have successfully logged in!`,
      });
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
        return res.status(400).json({ error: 'Passwords do not match' }); // change json to render and add the route
      }

      if (!acceptTos) {
        return res
          .status(400)
          .json({ error: 'You must accept the Terms of Service' }); // change json to render and add the route
      }

      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ error: 'Username already exists' }); // change json to render and add the route
      }

      let user1 = await User.findOne({ email });
      if (user1) {
        return res.status(400).json({ error: 'Email already exists' }); //change json to render and add the route
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

      await user.save();

      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );

      // Save user token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      });

      const link = `http://localhost:3000/user/verify`;
      await mailFunctions.sendVerificationEmail(user.email, link, username);

      return res
        .status(201)
        .json({
          message: `Hello ${user.firstname}, Congratulations on successfully registering! 🎉 Please check your email for a verification link. 🌟`,
        });
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
    try{
      const user = await User.findById(req.user.user_id);

      const response = {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      };
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user) {
        return res.status(404).json({error: 'User not found'});
      }
      const response = {
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
      };
      res.status(200).json(response);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while getting user' });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      // Getting the token from cookies because it is more secure this way.
      const { token } = req.cookies;
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findByIdAndUpdate(decoded.user_id, {
        is_verified: true,
      });
      res
        .status(201)
        .json({
          message: `Congratulations! ${user.firstname} 🎉 Your email has been successfully verified. Welcome to our community! 🌟`,
        }); // we can add congratulations message here instead of json user with a timer. After a couple of seconds it can go to signin page.
    } catch (error) {
      res.status(500).json(error);
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
  updateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const { fullName, avatar } = req.body;

      if (fullName) {
        user.fullName = fullName;
      }

      if (avatar) {
        user.avatar = avatar;
      }
      await user.save();

      res.status(200).json(`User ${user.username} updated`);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while updating user' });
    }
  },
  changePassword: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the provided old password matches the stored password
      const { oldPassword, newPassword1, newPassword2 } = req.body;

      if (newPassword1 !== newPassword2) {
        return res.status(400).json({ error: 'New passwords do not match' });
      }

      const passwordMatch = await bcrypt.compare(
        oldPassword,
        user.password_hash
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid old password' });
      }

      // Hash the new password and update it in the user document
      const hashedNewPassword = await bcrypt.hash(newPassword1, 10);
      user.password_hash = hashedNewPassword;
      await user.save();

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal Server Error while changing password' });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if(!email) {
        return res.status(400).json({error: 'Email is required'});
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a random reset token and create a JWT
      const resetJwtToken = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: '1h' }
      );

      // Set the reset JWT token as a cookie with an expiration time
      res.cookie('resetToken', resetJwtToken, {
        httpOnly: true,
        secure: false, // true for https
        sameSite: 'strict',
        maxAge: 3600000, // Reset token valid for 1 hour
      });
      // Generate a randomized temporary password
      const temporaryPassword = Math.random().toString(36).slice(-8); // Generate an 8-character temporary password

      // Hash the temporary password
      const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, 10);

      // Update the user's password with the temporary password
      user.password_hash = hashedTemporaryPassword;
      await user.save();

      // Send email with reset link, which can be a link to your frontend reset password page
      const resetLink = `http://localhost:3000/users/signin`;
      mailFunctions.sendTemporaryPasswordEmail(
        user.email,
        resetLink,
        user.username,
        temporaryPassword
      );

      return res.status(200).json({ message: 'Reset password sent to your email' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
