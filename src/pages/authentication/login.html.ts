import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const route = '/login';
export const title = 'Login';
export const description = 'Login page';

export const components = ['/public/components/authentication/auth-form.js'];

export const page = ({ webAuthToken, magicLink }) => {
  return html`<auth-form
    primary=${magicLink ? 'register' : 'login'}
    magic-link=${magicLink}
    web-auth-token=${webAuthToken}
  ></auth-form>`;
};

import { authenticationMiddleware } from '../../middleware/auth.js';
export const middleware = [
  authenticationMiddleware({
    authorizedRedirect: '/',
  }),
];

import prisma from '../../db/client.js';
export const get = async (req, res) => {
  const magicLink = req.query.magicLink;
  const newWebAuth = await prisma.webAuthToken.create({
    data: {
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
  res.render('authentication/login', {
    webAuthToken: newWebAuth.token,
    magicLink,
  });
};
