import { html } from 'lit';

export const title = 'Home page';
export const description = 'This is the home page of the website.';
import './components/x-counter.js?hydrate=true';

export const route = '/';
export { template } from '../templates/root.template.js';
export const page = (data: { authenticated: boolean }) => {
  const { authenticated } = data;
  return html`
    <sl-card>
      <h1 slot="header">Index</h1>
      <p>Authenticated: ${authenticated}</p>
      <x-counter></x-counter>
    </sl-card>
    <script type="module" src="/public/js/pages/index.js"></script>
  `;
};

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];
