import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('x-counter')
export class Counter extends LitElement {
  @property({ type: Boolean }) hydrated = false;

  firstUpdated() {
    setTimeout(() => {
      this.hydrated = true;
    }, 500);

    import('@shoelace-style/shoelace/dist/components/button/button.js');
    import('@shoelace-style/shoelace/dist/components/icon/icon.js');
  }

  render() {
    return html`
      <div class="x-counter">
        <sl-button circle @click=${this.decrement}
          ><sl-icon name="dash-circle"></sl-icon
        ></sl-button>
        <span>${this.count}</span>
        <sl-button circle @click=${this.increment}
          ><sl-icon name="plus-circle"></sl-icon
        ></sl-button>
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

        padding: var(--sl-spacing-2x-small);
        border: 1px solid var(--sl-color-gray-200);
        border-radius: 50px;
        background-color: var(--sl-color-gray-100);
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
