import type { Request, Response } from 'express';
import { html } from 'lit';

export { template } from '../templates/root.template.js';

interface RequestWithLocals extends Request {
  locals: {
    authenticated: boolean;
    user?: {
      id: number;
      name: string;
    };
  };
}

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

export const middleware = [authMiddleware, userFromSession];
export const get = async (request: RequestWithLocals, res: Response) => {
  const authenticated = request?.locals?.authenticated;
  const user = request?.locals?.user || {};

  res.render('index', { authenticated, user });
};
export const post = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await prisma.user.create({ data: { name, email } });
  res.redirect('/');
};

function authMiddleware(req, _res, next) {
  req.locals = { authenticated: true };
  next();
}

function userFromSession(_req, _res, next) {
  next();
}
