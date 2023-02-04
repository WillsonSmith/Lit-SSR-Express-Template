import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { html } from 'lit';

export const components = ['/public/js/pages/admin/users/index.js'];

import '../../../components/Lists/resource-list/resource-list.js';
import '../../../components/Lists/resource-list/resource-list-item.js';

type Data = { users: User[] };
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

import prisma from '../../../db/client.js';
import { requiresPermissionMiddleware } from '../../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/admin/login',
  }),
];

export const handler = async () => {
  const users = await prisma.user.findMany();
  return {
    users,
  };
};

export const get = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.render('admin/users/userIndex', { authenticated: true, users });
};

export const route = '/admin/users';
export { template } from './_template.js';
