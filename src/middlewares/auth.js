const adminAuthMiddleWare = (req, res, next) => {
  console.log('Admin auth is getting check');
  const token = 'xyz';
  const isAdminAuthorized = token === 'xyz';
  if (!isAdminAuthorized) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

const userAuthMiddleWare = (req, res, next) => {
  console.log('User auth is getting check');
  const token = 'xyzw';
  const isUserAuthorized = token === 'xyz';
  if (!isUserAuthorized) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

module.exports = { adminAuthMiddleWare, userAuthMiddleWare };
