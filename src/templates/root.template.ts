import { HTMLTemplateResult } from 'lit';
import { html } from 'lit';

import '../components/page-layout.js';

export const template = (page, data): HTMLTemplateResult => {
  const { title = 'My App', description = 'My cool app', lang = 'en' } = data;

  return html`
    <!DOCTYPE html>
    <html-so lang=${lang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title-so>${title}</title-so>
        <meta-so name="description" content=${description}></meta-so>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/public/css/index.css" />
      </head>
      <body>
        <page-layout title="My app" size="medium"> ${page(data)} </page-layout>
        <script type="module" src="/public/js/global.js"></script>
      </body>
    </html-so>
  `;
};
