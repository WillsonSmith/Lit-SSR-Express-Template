import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { User } from '@prisma/client';

@customElement(`user-list`)
export class UserList extends LitElement {
  @property({ type: Array }) users: User[] = [];
  render() {
    if (!this.users.length) return html`<p>No users</p>`;
    return html`
      <ul>
        ${this.users.map((user) => html`<li>${user.name}</li>`)}
      </ul>
    `;
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'user-list': UserList;
  }
}
