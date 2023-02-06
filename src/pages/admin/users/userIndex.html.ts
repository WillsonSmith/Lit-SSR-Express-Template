import type { User } from '@prisma/client';
import { html, css } from 'lit';

import '../../../components/Lists/resource-list/resource-list.js';
import '../../../components/Lists/resource-list/resource-list-item.js';

import prisma from '../../../db/client.js';

export const route = '/admin/users';
export const handler = async req => {
  const users = await prisma.user.findMany();
  return {
    users,
    path: req.path,
  };
};

type Data = { users: User[]; path?: string };
export const styles = [
  css`
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
];

export const page = ({ users }: Data) => {
  return html`
    <style>
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    </style>
    <sl-card>
      <div slot="header" class="card-header">
        <h2>Users</h2>
        <sl-button pill size="small" href="/admin/users/new"
          ><sl-icon slot="prefix" name="person-plus"></sl-icon>Add user</sl-button
        >
      </div>
      <div>
        <resource-list>
          ${users.map(
            user => html`
              <resource-list-item href="/admin/users/${user.id}"> ${user.name} </resource-list-item>
            `,
          )}
        </resource-list>
      </div>
    </sl-card>
  `;
};
export const components = ['/public/js/pages/admin/users/index.js'];

import { requiresPermissionMiddleware } from '../../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/admin/login',
  }),
];

export { template } from './_template.js';
