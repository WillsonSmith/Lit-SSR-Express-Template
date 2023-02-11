import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('main-nav')
export class MainNav extends LitElement {
  @property({ type: Boolean }) authenticated = false;
  @property({ type: Boolean }) isAdmin = false;
  render() {
    return html`
      <nav>
        <ul role="list">
          <main-nav-item href="/">Home</main-nav-item>
          ${this.isAdmin ? html`<main-nav-item href="/admin">Admin</main-nav-item>` : ''}
          ${this.authenticated
            ? html`<main-nav-item href="/logout">Logout</main-nav-item>`
            : html`<main-nav-item href="/login">Login</main-nav-item>`}
        </ul>
      </nav>
    `;
  }

  static styles = [
    css`
      ul[role='list'] {
        display: flex;
        gap: var(--sl-spacing-x-small);
        list-style: none;
        margin: 0;
        padding: 0;
      }

      ul > *:first-child {
        flex: 1;
      }
    `,
  ];
}

@customElement('main-nav-item')
export class MainNavItem extends LitElement {
  @property({ type: String }) href = '';
  render() {
    return html`
      <li>
        <sl-button href=${this.href} pill size="small">
          <slot></slot>
        </sl-button>
      </li>
    `;
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'main-nav': MainNav;
    'main-nav-item': MainNavItem;
  }
}

import '@shoelace-style/shoelace/dist/components/button/button.js';
