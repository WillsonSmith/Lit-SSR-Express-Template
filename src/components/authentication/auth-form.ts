import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement(`auth-form`)
export class AuthForm extends LitElement {
  @property({ type: String, attribute: 'magic-link' }) magicLink:
    | string
    | undefined = undefined;
  render() {
    return html`
      <div class="form">
        ${this.magicLink
          ? html`<sl-button>Register account</sl-button>`
          : nothing}
        <sl-button variant="primary" outline>Login with Passkey</sl-button>
      </div>
    `;
  }

  static styles = [
    css`
      .form {
        display: grid;
        grid-gap: var(--sl-spacing-medium);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-form': AuthForm;
  }
}

import '@shoelace-style/shoelace/dist/components/button/button.js';
