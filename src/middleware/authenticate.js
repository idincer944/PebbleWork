const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('../app');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid token' });
        }

        const newUser = await User.findById(user.user_id)
        console.log(newUser.is_verified)

        if(!newUser.is_verified) {
          return res.status(401).json({message: 'Please verify your account first'})
        }
        
        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findById(req.user.user_id);

  if (!user.is_admin) {
    return res.status(403).json({ error: 'Access Denied' });
  }

  next();
};
