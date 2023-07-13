const jwt = require('jsonwebtoken');

const authenticate = () => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
};

module.exports = authenticate;
