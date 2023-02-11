import type { Request, Response } from 'express';
import { html } from 'lit';

export const title = 'Admin Dashboard';
export const description = 'Manage the website.';

import './components/adminIndex.js?hydrate=true';
import '../../components/Lists/resource-list/resource-list.js';
import '../../components/Lists/resource-list/resource-list-item.js';
export const page = () => {
  return html`
    <h1>Admin</h1>
    <sl-card>
      <p slot="header">Manage</p>
      <resource-list>
        <resource-list-item href="/admin/users">Users</resource-list-item>
      </resource-list>
    </sl-card>
  `;
};

import { requiresPermissionMiddleware } from '../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/admin/login',
  }),
];
export const get = async (_req: Request, res: Response) => {
  res.render('admin', { authenticated: true });
};

export const route = '/admin';
export { template } from '../../templates/root.template.js';
