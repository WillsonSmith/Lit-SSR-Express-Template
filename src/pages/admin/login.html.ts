import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const components = [
  '/public/js/pages/adminLogin.js',
  '/public/components/authentication/auth-form.js',
];

import '../../components/forms/form-layout.js';
export const page = ({ magicLink }) => {
  return html`
    <sl-card>
      <div>
        <auth-form magic-link=${magicLink}></auth-form>
        <sl-divider></sl-divider>
        <form method="post">
          <form-layout>
            <p style="text-align: center">
              Or enter the administrator password to set up the account.
            </p>
            <sl-input
              label="Admin password"
              id="password"
              type="password"
              name="password"
              help-text="This will generate a magic link you can use to register a new passkey."
            ></sl-input>
            <sl-button type="submit">Create magic link</sl-button>
          </form-layout>
        </form>
      </div>
    </sl-card>
  `;
};

export const route = '/admin/login';
export const get = (req, res) => {
  const { magicLink } = req.query;
  res.render('admin/login', {
    magicLink,
  });
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

  res.redirect('/admin');
};
