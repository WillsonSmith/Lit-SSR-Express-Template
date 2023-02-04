import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('form-layout')
export class MyComponent extends LitElement {
  @property({ type: Number }) columns = 1;
  render() {
    return html`
      <div class="form-layout columns-${this.columns}">
        <slot></slot>
      </div>
    `;
  }

  static styles = [
    css`
      .form-layout {
        display: grid;
        grid-gap: var(--sl-spacing-medium);
      }

      .form-layout.columns-2 {
        grid-template-columns: repeat(2, 1fr);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'form-layout': MyComponent;
  }
}
