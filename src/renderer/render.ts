import type { RenderResult } from '@lit-labs/ssr';
import { render } from '@lit-labs/ssr';

export const renderPage = async (pageImport, data) => {
  const { template, page, ...rest } = pageImport;

  return templateToString(
    render(
      template(page, {
        ...rest,
        ...data,
      })
    )
  );
};

async function templateToString(template: RenderResult) {
  let outputString = '';
  for (const chunk of template) {
    let stringToTransform = await chunk;
    outputString += stringToTransform;
  }
  outputString = outputString.replace(/<title-so><!--lit-part-->/g, '<title>');
  outputString = outputString.replace(
    /<!--\/lit-part--><\/title-so>/g,
    '</title>'
  );
  outputString = outputString.replace(/<(.*?)-so/g, '<$1');
  return outputString;
}
