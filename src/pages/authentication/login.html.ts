import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const route = '/login';
export const title = 'Login';
export const description = 'Login page';

export const components = [
  '/public/components/authentication/authentication-form.js',
];

import '../../components/authentication/authentication-form.js';
export const page = () => {
  return html`<authentication-form></authentication-form>`;
};

import { authenticationMiddleware } from '../../middleware/auth.js';
export const middleware = [
  authenticationMiddleware({
    authorizedRedirect: '/',
  }),
];
export const get = async (req, res) => {
  req.session.webauthToken = crypto.randomUUID();
  res.render('authentication/login');
};
