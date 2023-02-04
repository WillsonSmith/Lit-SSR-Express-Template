import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('resource-list')
export class ResourceList extends LitElement {
  render() {
    return html`
      <div class="resource-list">
        <ul class="resource-list-items">
          <slot></slot>
        </ul>
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        --gap: var(--sl-spacing-medium);
        display: block;
      }
      ::slotted(resource-list-item) {
        display: block;
      }

      .resource-list-items {
        display: grid;
        gap: var(--gap);

        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      .resource-list-items > * + * {
        border-top: 1px solid var(--sl-color-gray-200);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'resource-list': ResourceList;
  }
}
