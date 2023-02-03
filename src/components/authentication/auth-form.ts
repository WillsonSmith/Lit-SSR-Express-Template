import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type PrimaryButton = 'login' | 'register';

@customElement(`auth-form`)
export class AuthForm extends LitElement {
  @property({ type: String, attribute: 'magic-link' }) magicLink:
    | string
    | undefined = undefined;
  @property({ type: String, attribute: 'primary' }) primary: PrimaryButton =
    'login';
  render() {
    return html`
      <div class="form">
        ${this.magicLink
          ? html`<sl-button outline variant="primary"
              >Register with Passkey</sl-button
            >`
          : nothing}
        <sl-button
          variant=${this.primary === 'login' ? 'primary' : 'default'}
          outline
          >Login with Passkey</sl-button
        >
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
