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

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];

type RequestWithAuth = Request & { authenticated: boolean };
export const get = async (request: RequestWithAuth, res: Response) => {
  const authenticated = request.authenticated;
  res.render('index', { authenticated });
};

export const route = '/';
export { template } from '../templates/root.template.js';
