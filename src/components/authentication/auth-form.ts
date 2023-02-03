import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

type PrimaryButton = 'login' | 'register';

@customElement(`auth-form`)
export class AuthForm extends LitElement {
  @property({ type: String, attribute: 'web-auth-token' }) webAuthToken:
    | string
    | undefined = undefined;
  @property({ type: String, attribute: 'magic-link' }) magicLink:
    | string
    | undefined = undefined;
  @property({ type: String, attribute: 'primary' }) primary: PrimaryButton =
    'login';
  render() {
    return html`
      <div class="form">
        ${this.magicLink
          ? html`
              <sl-button
                outline
                variant=${this.primary === 'register' ? 'primary' : 'default'}
                @click=${this.registerWithWebAuth}
              >
                Register with Passkey
              </sl-button>
            `
          : nothing}
        <sl-button
          variant=${this.primary === 'login' ? 'primary' : 'default'}
          outline
          ?disabled=${!this.webAuthToken}
          @click=${this.loginWithWebAuth}
        >
          Login with Passkey
        </sl-button>
      </div>
    `;
  }

  private async loginWithWebAuth(event: Event) {
    event.preventDefault();
    if (!this.webAuthToken) {
      return;
    }

    const challengeUrl = '/login/generate-challenge';
    const queryParams = new URLSearchParams([
      [`webAuthToken`, this.webAuthToken],
    ]);

    const loginOptions = await fetch(`${challengeUrl}?${queryParams}`);
    const loginOptionsJson = await loginOptions.json();

    const credential = await startAuthentication(loginOptionsJson);

    const response = await fetch(`/login/verify`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        webAuthToken: this.webAuthToken,
        ...credential,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.success) {
      console.log(`Authentication successful`);
      window.location.reload();
    }
  }

  private async registerWithWebAuth(event: Event) {
    event.preventDefault();
    if (!this.webAuthToken || !this.magicLink) {
      return;
    }

    const challengeUrl = '/register/generate-challenge';
    const queryParams = new URLSearchParams([
      [`webAuthToken`, this.webAuthToken],
      [`magicLink`, this.magicLink],
    ]);

    const registerOptions = await fetch(`${challengeUrl}?${queryParams}`);
    const registerOptionsJson = await registerOptions.json();

    const credential = await startRegistration(registerOptionsJson);

    const response = await fetch(`/register/verify-challenge`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        webAuthToken: this.webAuthToken,
        magicLink: this.magicLink,
        ...credential,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.success) {
      console.log(`Registration successful`);
      window.location.reload();
    }
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
