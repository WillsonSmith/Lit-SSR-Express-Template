import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { add } from '../../../../public/js/add.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  render() {
    console.log(add(1, 2));
    return html`<slot>lol</slot>`;
  }

  static styles = [css``];
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent;
  }
}
