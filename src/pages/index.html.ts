import type { Request, Response } from 'express';
import { html } from 'lit';
export { template } from '../templates/root.template.js';

export const route = '/';
export const title = 'Index';
export const description = 'Index page';

export const page = data => {
  const { authenticated } = data;
  return html`
    <sl-card>
      <h1>Index</h1>
      <p>Index page</p>
      <p>Authenticated: ${authenticated}</p>
    </sl-card>
  `;
};

export const components = ['/public/js/pages/index.js'];

type RequestWithAuthDetails = Request & { authenticated: boolean; user: any };
import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];
export const get = async (request: RequestWithAuthDetails, res: Response) => {
  const authenticated = request.authenticated;
  const user = request.user || {};

  res.render('index', { authenticated, user });
};
