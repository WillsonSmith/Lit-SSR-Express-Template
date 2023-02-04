import { html } from 'lit';

export const title = 'Admin';
export const description = 'Admin page';
export const page = () => {
  return html`
    <h1>Admin</h1>
    <p>Admin page</p>
    <div>
      <a href="/admin/users">Users</a>
    </div>
  `;
};

import { requiresPermissionMiddleware } from '../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/admin/login',
  }),
];
export const get = async (_req, res) => {
  res.render('admin', { authenticated: true });
};

export const route = '/admin';
export { template } from '../../templates/root.template.js';
