import { html, css } from 'lit';

export const title = 'Home page';
export const description = 'This is the home page of the website.';
import './components/x-counter.js?hydrate=true';
import './components/index.js?hydrate=true';

export const route = '/';
export { template } from '../templates/root.template.js';

type data = {
  authenticated: boolean;
  isAdmin: boolean;
};
export const page = ({ authenticated }: data) => {
  return html`
    <sl-card>
      <h1 slot="header">Index</h1>
      <div class="card-content">
        <p>Authenticated: ${authenticated}</p>
        <div>
          <x-counter></x-counter>
        </div>
      </div>
    </sl-card>
  `;
};

export const styles = [
  css`
    .card-content {
      display: grid;
      gap: var(--sl-spacing-small);
    }
  `,
];

import { authenticationMiddleware } from '../middleware/auth.js';
export const middleware = [authenticationMiddleware()];

export const handler = async ({ authenticated, user }) => {
  return {
    authenticated,
    isAdmin: user?.role?.name === 'ADMIN',
  };
};
