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
    <h2>Users</h2>
    ${users.map((user) => html`<p>${user.name}</p>`)}

    <h2>Create user</h2>
    <form method="post">
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <button type="submit">Create</button>
    </form>
  </page-layout>
`;

import prisma from '../prisma/client.js';
export const components = ['/public/components/page-layout.js'];
export const get = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.render('index', { users });
};
export const post = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await prisma.user.create({ data: { name, email } });
  res.redirect('/');
};
