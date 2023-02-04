import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('resource-list-item')
export class ResourceListItem extends LitElement {
  @property({ type: String }) href = '';
  render() {
    return html`<li class="resource-list-item">
      <a href=${this.href} class="link"><slot></slot></a>
    </li>`;
  }

  static styles = [
    css`
      :host {
        --padding: var(--sl-spacing-medium);
      }
      .resource-list-item {
        display: block;
      }
      .link {
        display: block;
        padding: var(--padding);
        text-decoration: none;
        color: var(--sl-color-gray-700);
        background: var(--sl-color-gray-100);
      }
      .link:hover {
        background: var(--sl-color-gray-200);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'resource-list-item': ResourceListItem;
  }
}
