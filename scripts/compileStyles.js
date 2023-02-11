import { build as esbuild } from 'esbuild';
import { workerData, parentPort } from 'worker_threads';

const { file: filePath, cachedStyles } = workerData;
async function process() {
  const { styles } = await import(`../${filePath}`);
  if (styles) {
    const outputPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').slice(-1)[0].split('.')[0];

    let returned = [];
    for (const [index, style] of styles.entries()) {
      if (cachedStyles.get(filePath) === style.cssText) continue;
      const css = style.cssText;
      returned.push(css);

      esbuild({
        stdin: {
          contents: css,
          resolveDir: 'src',
          loader: 'css',
        },
        outfile: `${outputPath}/assets/css/${fileName}-${index}.css`,
      });
    }
    return parentPort?.postMessage(returned);
  }
}
process();
