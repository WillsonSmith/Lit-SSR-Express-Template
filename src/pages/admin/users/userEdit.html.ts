import { html } from 'lit';
import prisma from '../../../db/client.js';

export const page = ({ user, roles, action = '/admin/users/:id' }) => {
  const isAdminUser = user.role.name === 'ADMIN';
  return html`
    <sl-card>
      <div slot="header">
        <h2>Edit user</h2>
      </div>

      <form id="user-form" method="post" action=${action}>
        <form-layout columns=${2}>
          <sl-input
            label="Name"
            id="name"
            name="name"
            value="${user.name}"
            help-text="The user's name."
          ></sl-input>
          <sl-select
            label="Role"
            id="role"
            name="role"
            help-text="The user's role."
            value=${user.role.id}
          >
            ${roles.map(role => html` <sl-option value=${role.id}>${role.name}</sl-option> `)}
          </sl-select>
        </form-layout>
      </form>
      <div slot="footer">
        <sl-button type="submit" variant="primary" outline form="user-form">Update user</sl-button>
      </div>
    </sl-card>
  `;
};

import { requiresPermissionMiddleware } from '../../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', { unauthorizedRedirect: '/admin/login' }),
];

export const route = '/admin/users/:id';
export const get = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const roles = await prisma.role.findMany();
  res.render('admin/users/userEdit', { authenticated: true, user, roles });
};

export { template } from './_template.js';
