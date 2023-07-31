const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('../app');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
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
