import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Role } from '@prisma/client';
import type { UserWithRole } from '../../../types/User.js';

type Data = {
  user: UserWithRole;
  roles: Role[];
  action?: string;
};

import prisma from '../../../db/client.js';
export const route = '/admin/users/:id';

export const action = async (req, res) => {
  const { id } = req.params;
  await updateUser(id, req.body);
  res.redirect('/admin/users');
};
export const handler = async req => {
  const { id } = req.params;
  const user = await getUser(id);
  const roles = await prisma.role.findMany();

  const breadcrumbPath = [...req.path.split('/').slice(0, -1), user.name].join('/');

  return {
    user,
    roles,
    action: req.path,
    path: breadcrumbPath,
  };
};

export const page = ({ user, roles, action }: Data) => {
  const ActionType = user.id ? 'Update' : 'Create';

  const form = html`
    <form id="user-form" method="post" formAction=${ifDefined(action)}>
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

export { template } from './_template.js';

type UserFields = {
  id: string;
  role: string;
  name?: string;
  password?: string;
};

async function getUser(id) {
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
  return user;
}

async function updateUser(id: string, { name, role: roleId, password }: UserFields) {
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      role: {
        connect: {
          id: parseInt(roleId),
        },
      },
      password,
    },
  });
  return user;
}
