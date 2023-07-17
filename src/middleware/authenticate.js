const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = () => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;

        next();

        // //Checking if the user is an admin
        // User.findByPk(user.userId).then(user => {
        //   user.getRoles().then(roles => {
        //     for (let i=0; i < roles.length; i++){
        //       if (roles[i].name === 'admin') {
        //         next();
        //           return;
        //       }
        //     }
        //     res.status(403).send({ message: 'Require Admin Role !'})
        //   });
        // });
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

module.exports = authenticate;
