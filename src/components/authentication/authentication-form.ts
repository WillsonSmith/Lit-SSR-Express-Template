import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

@customElement(`authentication-form`)
export class AuthenticationForm extends LitElement {
  @property({ type: String }) challenge = ``;
  render() {
    return html`
      <div>
        <button @click=${this.startAuthentication}>Authenticate</button>
        <button @click=${this.startRegistration}>Register</button>
      </div>
    `;
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

    if (response.ok) {
      console.log(`Authentication successful`);
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

    if (response.ok) {
      console.log(`Registration successful`);
    }
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'authentication-form': AuthenticationForm;
  }
}
