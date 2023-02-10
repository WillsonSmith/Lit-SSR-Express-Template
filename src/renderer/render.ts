import type { RenderResult } from '@lit-labs/ssr';
import { render } from '@lit-labs/ssr';

export const renderPage = async (pageImport, data) => {
  const { template, page, components, styles, filePath, route, ...rest } = pageImport;

  return templateToString(
    render(
      template(page, {
        ...rest,
        ...data,
      }),
    ),
    components,
    styles,
    filePath,
    route,
  );
};

async function templateToString(
  template: RenderResult,
  componentsToHydrate,
  styles,
  filePath,
  route,
) {
  let outputString = '';
  for (const chunk of template) {
    const stringToTransform = await chunk;
    outputString += stringToTransform;
  }
  outputString = outputString.replace(/<title-so><!--lit-part-->/g, '<title>');
  outputString = outputString.replace(/<!--\/lit-part--><\/title-so>/g, '</title>');
  outputString = outputString.replace(/<(.*?)-so/g, '<$1');

  outputString = outputString.replace('</body>', hydrateString(componentsToHydrate) + '</body>');

  if (styles) {
    const fileName = filePath.split('/').pop().replace('.html.js', '');
    outputString = outputString.replace(
      '</head>',
      `${styles
        .map(
          (_, index) =>
            `<link rel="stylesheet" href="${
              route === '/' ? '' : route
            }/assets/css/${fileName}-${index}.css">`,
        )
        .join('\n')}
    </head>`,
    );
  }

  return outputString;
}

function hydrateString(componentsToHydrate) {
  return `<script type="module">
  import { hydrate } from '/public/js/hydrate.js';
  hydrate(${JSON.stringify(componentsToHydrate) || []});
</script>`;
}

// this doesn't actually work because <!--lit-part--> is on a new line.
export const renderNew = function* (pageImport, data) {
  const { template, page, components, ...rest } = pageImport;
  for (const chunk of render(
    template(page, {
      ...rest,
      ...data,
    }),
  )) {
    let output = chunk;
    if (typeof chunk === 'string') {
      output = chunk.replace(/<title-so><!--lit-part-->/g, '<title>');
      output = output.replace(/<!--\/lit-part--><\/title-so>/g, '</title>');
      output = output.replace(/<(.*?)-so/g, '<$1');

      output = output.replace(
        '<body>',
        `<style>
body[unresolved] {
  display: none;
}
</style>
<script>
if (HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
  document.body.removeAttribute('dsd-pending');
}
</script>
<body unresolved>`,
      );

      output = output.replace('</body>', hydrateString(components) + '</body>');
    }

    yield output;
  }
};
