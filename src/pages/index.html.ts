import type { Request, Response } from 'express';
import { html } from 'lit';

export const title = 'Index';
export const description = 'Index page';
export const components = ['/public/js/pages/index.js'];

export const page = (data: { authenticated: boolean }) => {
  const { authenticated } = data;
  return html`
    <sl-card>
      <h1>Index</h1>
      <p>Index page</p>
      <p>Authenticated: ${authenticated}</p>
    </sl-card>
  `;
};

type RequestWithAuth = Request & { authenticated: boolean };

export const route = '/';
export const get = async (request: RequestWithAuth, res: Response) => {
  const authenticated = request.authenticated;
  res.render('index', { authenticated });
};

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];

export { template } from '../templates/root.template.js';
