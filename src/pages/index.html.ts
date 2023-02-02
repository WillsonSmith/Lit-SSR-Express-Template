import type { Request, Response } from 'express';
import { html } from 'lit';
export { template } from '../templates/root.template.js';

export const route = '/';
export const title = 'Index';
export const description = 'Index page';

export const page = (data) => {
  const { authenticated } = data;
  return html`
    ${authenticated ? html` <h1>Index</h1> ` : html`<p>Not authenticated</p>`}
  `;
};

import prisma from '../db/client.js';
export const components = ['/public/components/page-layout.js'];

type RequestWithAuthDetails = Request & { authenticated: boolean; user: any };

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];
export const get = async (request: RequestWithAuthDetails, res: Response) => {
  const authenticated = request.authenticated;
  const user = request.user || {};

  res.render('index', { authenticated, user });
};
export const post = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await prisma.user.create({ data: { name, email } });
  res.redirect('/');
};
