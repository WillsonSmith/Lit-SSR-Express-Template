import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

type FormType = 'create' | 'password-reset';

@customElement(`authentication-form`)
export class AuthenticationForm extends LitElement {
  @property({ type: String }) challenge = ``;
  @property({ type: String, attribute: 'form-type' })
  formType: FormType = `create`;
  render() {
    if (this.formType === `password-reset`) {
      return html`
        <div>
          <button @click=${this.addAuthenticationKey}>Add Passkey</button>
        </div>
      `;
    }
    return html`
      <div>
        <button @click=${this.startAuthentication}>Authenticate</button>
        <button @click=${this.startRegistration}>Register</button>
      </div>
    `;
  }

  private async addAuthenticationKey(event: Event) {
    event.preventDefault();
    const options = await fetch(`/password-reset/challenge`);
    const optionJson = await options.json();
    const credential = await startRegistration(optionJson);

    const response = await fetch(`/password-reset/verify`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(credential),
    });

    const responseJson = await response.json();

    if (responseJson.success) {
      console.log(`Authentication successful`);
      window.location.reload();
    }
  }

  private async startAuthentication(event: Event) {
    event.preventDefault();
    // const challenge = this.challenge;
    const options = await fetch(`/login/challenge`);
    console.log(options);
    const optionJson = await options.json();
    const credential = await startAuthentication(optionJson);
    console.log(credential);
    const response = await fetch(`/login/verify`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(credential),
    });

    const responseJson = await response.json();

    if (responseJson.success) {
      console.log(`Authentication successful`);
      window.location.reload();
    }
  }

  private async startRegistration(event: Event) {
    event.preventDefault();
    const options = await fetch(`/register/challenge`);
    console.log(options);
    const optionJson = await options.json();
    const credential = await startRegistration(optionJson);

    const response = await fetch(`/register/verify`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(credential),
    });

    const responseJson = await response.json();

    if (responseJson.success) {
      console.log(`Registration successful`);
      window.location.reload();
    }
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'authentication-form': AuthenticationForm;
  }
}
