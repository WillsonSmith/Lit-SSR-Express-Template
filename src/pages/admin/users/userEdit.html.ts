import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import prisma from '../../../db/client.js';
import type { Role } from '@prisma/client';
import type { UserWithRole } from '../../../types/User.js';

type Data = {
  user: UserWithRole;
  roles: Role[];
  action?: string;
};

export const page = ({ user, roles, action }: Data) => {
  const ActionType = user.id ? 'Update' : 'Create';

  const form = html`
    <form id="user-form" method="post" action=${ifDefined(action)}>
      <form-layout columns=${2}>
        <sl-input
          label="Name"
          id="name"
          name="name"
          placeholder="Name"
          value=${user.name || ''}
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

        <sl-input
          label="Password"
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          help-text="Passwords are temporary."
        ></sl-input>
      </form-layout>
    </form>
  `;

  const card = html`
    <sl-card>
      <div slot="header">
        <h2>${ActionType} user</h2>
      </div>
      ${form}
      <div slot="footer">
        <sl-button type="submit" variant="primary" outline form="user-form"
          >${ActionType} user</sl-button
        >
      </div>
    </sl-card>
  `;

  return card;
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

  res.render('admin/users/userEdit', { action: req.path, authenticated: true, user, roles });
};

export const post = async (req, res) => {
  const { id } = req.params;
  const { name, role, password } = req.body;
  await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      role: {
        connect: {
          id: parseInt(role),
        },
      },
      password,
    },
  });
  res.redirect('/admin/users');
};

export { template } from './_template.js';
