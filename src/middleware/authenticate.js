const authenticate = function (redirect = '/user/signin') {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.direct(redirect);
    }
    req.user = req.session.user;
    next();
  };
};

module.exports = authenticate;
