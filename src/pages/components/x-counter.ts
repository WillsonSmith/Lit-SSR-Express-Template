import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('x-counter')
export class Counter extends LitElement {
  @property({ type: Boolean }) hydrated = false;

  firstUpdated() {
    setTimeout(() => {
      this.hydrated = true;
    }, 500);
  }
  render() {
    return html`
      <div>${this.hydrated ? 'Hydrated' : 'Not hydrated'}</div>
      <div class="x-counter">
        <button @click=${this.decrement}>-</button>
        <span>${this.count}</span>
        <button @click=${this.increment}>+</button>
      </div>
    `;
  }

  @property({ type: Number })
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  static styles = [
    css`
      :host {
        display: inline-block;
      }
      .x-counter {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-medium);
        font-variant-numeric: tabular-nums;

        padding: var(--sl-spacing-medium);
        border: 1px solid var(--sl-color-gray-200);
      }

      button {
        cursor: pointer;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'x-counter': Counter;
  }
}
