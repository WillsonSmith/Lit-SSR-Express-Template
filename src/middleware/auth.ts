export function authenticate({ redirectTo = '/login' } = {}) {
  return (req, res, next) => {
    req.isAuthenticated = req.isAuthenticated || isAuthenticated;
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect(redirectTo);
  };
}

function isAuthenticated() {
  return true;
}
