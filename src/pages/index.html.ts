import type { Request, Response } from 'express';
import { html } from 'lit';

export { template } from '../templates/root.template.js';

export const route = '/';
export const title = 'Index';
export const description = 'Index page';

import '../components/page-layout.js';

export const page = () => html`
  <page-layout title="My app" size="medium">
    <h1>Hello World!</h1>
  </page-layout>
`;

export const components = ['/public/components/page-layout.js'];
export const get = async (_: Request, res: Response) => {
  res.render('index');
};
