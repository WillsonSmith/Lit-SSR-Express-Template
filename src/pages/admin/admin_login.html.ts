import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const page = () => {
  return html`<form method="post">
    <label for="password">Password</label>
    <input type="password" name="password" />
    <button type="submit">Login</button>
  </form>`;
};

export const route = '/admin/login';
export const get = (_req, res) => {
  res.render('auth/admin/admin_login');
};

import prisma from '../../db/client.js';
export const post = async (req, res) => {
  const userQuery = await prisma.user.findMany({
    where: {
      role: {
        name: 'ADMIN',
      },
    },
    take: 1,
  });

  const user = userQuery.at(0);
  if (user.password !== req.body.password) {
    return res.status(401).send('Unauthorized');
  }

  const newSessionToken = await prisma.sessionToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  req.session.sessionToken = newSessionToken.token;
  req.session.user = {
    id: user.id,
    name: user.name,
  };

  res.redirect('/admin');
};
