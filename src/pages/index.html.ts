import { html } from 'lit';

export const title = 'Home page';
export const description = 'This is the home page of the website.';
// export const components = ['/public/js/pages/index.js'];

import './admin/users/components/my-component.js?hydrate=true';

export const route = '/';
export { template } from '../templates/root.template.js';
export const page = (data: { authenticated: boolean }) => {
  const { authenticated } = data;
  return html`
    <sl-card>
      <h1>Index</h1>
      <p>Index page</p>
      <p>Authenticated: ${authenticated}</p>
      <my-component>lol</my-component>
    </sl-card>
  `;
};

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];
