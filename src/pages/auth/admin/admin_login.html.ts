import { html } from 'lit';

export { template } from '../../../templates/root.template.js';

export const page = () => {
  return html` <div>Login</div> `;
};

export const route = '/admin/login';
export const get = (_req, res) => {
  res.render('auth/admin/admin_login');
};
