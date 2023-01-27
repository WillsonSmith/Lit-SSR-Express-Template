import type { Request, Response } from 'express';
import { html } from 'lit';

export { template } from '../templates/root.template.js';

export const route = '/';
export const title = 'Index';
export const description = 'Index page';

import '../components/page-layout.js';

import type { User } from '@prisma/client';
export const page = ({ users = [] }: { users: User[] }) => html`
  <page-layout title="My app" size="medium">
    ${users.map((user) => html`<p>${user.name}</p>`)}
  </page-layout>
`;

import prisma from '../prisma/client.js';
export const components = ['/public/components/page-layout.js'];
export const get = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.render('index', { users });
};
