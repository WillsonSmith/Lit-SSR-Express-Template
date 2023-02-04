import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('page-breadcrumbs')
export class Breadcrumbs extends LitElement {
  @property({ type: String }) path = '';

  render() {
    const breacrumbs = createBreadcrumbs(this.path);

    return html`
      <nav aria-label="breadcrumb">
        <ol role="list" class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          ${breacrumbs.map((breadcrumb, index) => {
            if (index === breacrumbs.length - 1) {
              return html`<li class="breadcrumb-item active" aria-current="page">
                ${breadcrumb.name}
              </li>`;
            }

            return html`<li class="breadcrumb-item">
              <a href="${breadcrumb.link}">${breadcrumb.name}</a>
            </li>`;
          })}
        </ol>
      </nav>
    `;
  }

  static styles = [
    css`
      .breadcrumb {
        list-style-type: none;
        padding: 0;
        margin: 0;

        display: flex;
        flex-wrap: wrap;
        gap: var(--sl-spacing-x-small);
      }

      .breadcrumb-item {
        display: flex;
        align-items: center;
      }

      .breadcrumb-item + .breadcrumb-item::before {
        content: '/';
        margin-inline-end: var(--sl-spacing-x-small);
      }

      .breadcrumb-item a {
        color: var(--sl-color-gray-900);
        text-underline-offset: var(--sl-spacing-3x-small);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'page-breadcru': Breadcrumbs;
  }
}

type Breadcrumb = {
  name: string;
  link: string;
};

function createBreadcrumbs(path: string): Array<Breadcrumb> {
  const breadcrumbs: Breadcrumb[] = [];
  const parts = path.split('/').filter(part => part !== '');

  let link = '';
  for (const part of parts) {
    link += `/${part}`;
    breadcrumbs.push({ name: part, link });
  }

  return breadcrumbs;
}
