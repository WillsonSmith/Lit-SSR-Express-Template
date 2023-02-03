import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement(`main-nav`)
export class MainNav extends LitElement {
  @property({ type: Boolean }) authenticated = false;
  render() {
    return html`
      <nav>
        <ul role="list">
          <main-nav-item href="/">Home</main-nav-item>
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
    `,
  ];
}

@customElement(`main-nav-item`)
export class MainNavItem extends LitElement {
  @property({ type: String }) href = '';
  render() {
    return html`
      <li>
        <a class="link" href=${this.href}>
          <slot></slot>
        </a>
      </li>
    `;
  }

  static styles = [
    css`
      .link {
        display: block;
        color: var(--sl-color-gray-700);
        background: var(--sl-color-gray-100);
        border-radius: var(--sl-border-radius-medium);
        border: 1px solid var(--sl-color-gray-200);
        padding: var(--sl-spacing-2x-small) var(--sl-spacing-small);
        text-decoration: none;
      }

      .link:hover {
        background: var(--sl-color-gray-200);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'main-nav': MainNav;
    'main-nav-item': MainNavItem;
  }
}
