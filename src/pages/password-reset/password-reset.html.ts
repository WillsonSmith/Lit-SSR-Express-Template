import { html } from 'lit';
export { template } from '../../templates/root.template.js';

export const route = '/password-reset';
export const title = 'Add a passkey';
export const description = 'A passkey is require to use this site.';
export const components = [
  '/public/components/authentication/authentication-form.js',
];
export const page = () => {
  return html`
    <h1>You must add a passkey to use this site.</h1>
    <authentication-form form-type="password-reset"></authentication-form>
  `;
};

import { authenticate } from '../../middleware/auth.js';
export const middleware = [authenticate()];
export const get = async (req, res) => {
  req.session.webauthToken = crypto.randomUUID();
  console.log(req.session.webauthToken);
  res.render('password-reset/password-reset');
};
