import { html } from 'lit';

export const template = (page, data) => {
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
      </head>
      <body>
        <main>${page(data)}</main>
        <script type="module">
          import { hydrate } from '/public/js/hydrate.js';
          hydrate();
        </script>
      </body>
    </html-so>
  `;
};
