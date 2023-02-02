import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement(`page-layout`)
export class PageLayout extends LitElement {
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  render() {
    return html`
      <div class="size-${this.size}">
        <slot></slot>
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: 1rem;
      }
      .size-small {
        max-width: 40ch;
        margin: 0 auto;
      }
      .size-medium {
        max-width: 60ch;
        margin: 0 auto;
      }
      .size-large {
        max-width: 80ch;
        margin: 0 auto;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'page-layout': PageLayout;
  }
}
