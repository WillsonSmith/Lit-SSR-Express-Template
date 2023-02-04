import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { template as rootTemplate } from '../../../templates/root.template.js';
import '../../../components/breadcrumbs/breadcrumbs.js';

export const template = (page, data) => {
  return rootTemplate(
    ({ path }) =>
      html`
        <page-breadcrumbs path=${ifDefined(path)}></page-breadcrumbs>
        <div>${page(data)}</div>
        <script type="module">
          const { hydrate } = await import('/public/js/hydrate.js');
          hydrate(['/public/js/pages/admin/users/index.js']);
        </script>
      `,
    data,
  );
};
