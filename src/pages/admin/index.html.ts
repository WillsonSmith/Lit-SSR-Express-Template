import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const route = '/admin';
export const title = 'Admin';
export const description = 'Admin page';

import { requiresPermissionMiddleware } from '../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/login',
  }),
];
export const page = () => {
  return html`<h1>Admin</h1>`;
};

export const get = async (_req, res) => {
  res.render('admin');
};
