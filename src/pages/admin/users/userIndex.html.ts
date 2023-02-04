import { html } from 'lit';

export const page = ({ users }) => {
  return html`
    <h1>Users</h1>
    <ul>
      ${users.map(user => html`<li>${user.name}</li>`)}
    </ul>
  `;
};

import prisma from '../../../db/client.js';
import { requiresPermissionMiddleware } from '../../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/admin/login',
  }),
];
export const get = async (_req, res) => {
  const users = await prisma.user.findMany();
  res.render('admin/users/userIndex', { authenticated: true, users });
};

export const route = '/admin/users';
export { template } from '../../../templates/root.template.js';
