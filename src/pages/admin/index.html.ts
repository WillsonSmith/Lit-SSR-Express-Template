import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const route = '/admin';
export const title = 'Admin';
export const description = 'Admin page';

export const middleware = [requiresPermissionMiddleware('ADMIN')];
export const page = () => {
  return html`<h1>Admin</h1>`;
};

export const get = async (_req, res) => {
  res.render('admin');
};

import { authenticationMiddleware } from '../../middleware/auth.js';
function requiresPermissionMiddleware(permission) {
  return (req, res, next) => {
    authenticationMiddleware({ unauthorizedRedirect: '/' })(req, res, () => {
      if (req.user.role.name === permission) {
        return next();
      }
      res.redirect('/');
    });
  };
}
