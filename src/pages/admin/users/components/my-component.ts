import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  render() {
    return html`<slot>lol</slot>`;
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent;
  }
}
