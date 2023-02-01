import { html } from 'lit';

export { template } from '../../templates/root.template.js';

export const route = '/password-reset';
export const title = 'Password reset required';
export const description = 'Password reset required page.';

export const components = [
  '/public/components/authentication/authentication-form.js',
];
export const page = () => {
  return html`
    <h1>Reset your password</h1>
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
