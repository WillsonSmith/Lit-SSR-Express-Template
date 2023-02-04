import { html } from 'lit';

import { template as rootTemplate } from '../../../templates/root.template.js';

export const template = (page, data) => {
  return rootTemplate(
    () =>
      html`
        <div>${page(data)}</div>
        <script type="module">
          const { hydrate } = await import('/public/js/hydrate.js');
          hydrate(['/public/js/pages/admin/users/index.js']);
        </script>
      `,
    data,
  );
};
