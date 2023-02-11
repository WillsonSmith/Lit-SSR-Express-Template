// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import glob from 'glob';
import choki from 'chokidar';
import { build as esbuild } from 'esbuild';

const cachedStyles = new Set();
if (process.argv.includes('--watch')) {
  watch();
}

import { readFile } from 'fs/promises';
import { join } from 'path';

async function watch() {
  console.log('Watching files for changes...');

  await compileNonPageServerTypescript();
  await compilePageTypescript();
  await compileClientTypescript();
  await compilePublicStyles();
  await compileAllPageStyles();

  choki.watch('src/**/*.ts').on('change', async path => {
    if (!path.includes('.html.ts')) {
      compileClientTypescript();
      compileNonPageServerTypescript();
    }

    if (path.includes('.html.ts')) {
      compilePageTypescript();
    }
  });

  const cssCache = new Map();
  choki.watch('app/pages/**/*.html.js').on('change', async path => {
    // Issue with CSS Cache. I am using a Set to cache, I am adding to it, but I am not removing from it.
    // Therefore when I change a file to a previous state it will not recompile the CSS.
    console.log(`Compiling page style for ${path}...`);
    compilePageStyles(path, cssCache);
  });
}

async function compileNonPageServerTypescript() {
  console.log('Compiling non-page server typescript...');
  const allTypescript = glob
    .sync('src/**/*.ts')
    .filter(file => !file.includes('public'))
    .filter(file => !file.includes('.html.ts'));
  esbuild({
    entryPoints: allTypescript,
    bundle: false,
    splitting: false,
    sourcemap: false,
    format: 'esm',
    platform: 'node',
    outdir: 'app',
  });
}

async function compileClientTypescript() {
  console.log('Compiling client typescript...');
  const componentDirs = glob.sync('src/**/components/**/*.ts');
  const componentsInputs = componentDirs.map(directory => {
    const asPublic = directory.replace('src/', '');
    const destination = asPublic.replace('.ts', '');
    return {
      [destination]: directory,
    };
  });

  const componentInputsObject = Object.assign({}, ...componentsInputs);

  const publicJs = glob.sync('src/public/**/*.ts');
  const publicInputs = publicJs.map(directory => {
    const root = directory.replace('src/public/', '');
    return {
      [root.replace('.ts', '')]: directory,
    };
  });

  const publicInputsObject = Object.assign({}, ...publicInputs);

  const entryPoints = Object.assign({}, componentInputsObject, publicInputsObject);
  esbuild({
    entryPoints,
    bundle: true,
    splitting: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    outdir: 'app/public',
  });
}

async function compilePageTypescript() {
  console.log('Compiling page typescript...');
  const pages = glob.sync('src/pages/**/*.html.ts');
  for (const page of pages) {
    await esbuild({
      entryPoints: [page],
      bundle: false,
      splitting: false,
      sourcemap: false,
      format: 'esm',
      platform: 'node',
      outdir: 'app',
      outbase: 'src',
      plugins: [
        {
          name: 'hydrate',
          setup(build) {
            build.onResolve({ filter: /\.html\.ts$/ }, args => {
              return {
                namespace: 'hydrate',
                path: args.path,
              };
            });

            build.onLoad({ filter: /.*/, namespace: 'hydrate' }, async args => {
              const file = args.path;

              const content = await readFile(file, 'utf-8');
              const transformedContent = content.replace(
                /import\s+["'](.+?)\?hydrate=true["']/g,
                'import "$1"',
              );

              const components = content.match(/import\s+["'](.+?)\?hydrate=true["']/g);
              if (components) {
                const componentImports = components.map(component => {
                  const match = component.match(/import\s+["'](.+?)\?hydrate=true["']/);
                  return match[1];
                });
                const publicPath = file
                  .replace('./src/', '/public/')
                  .split('/')
                  .slice(0, -1)
                  .join('/');
                const relativeComponentImportPaths = componentImports.map(component => {
                  return join(publicPath, component);
                });

                const exportString = `export const components = ${JSON.stringify(
                  relativeComponentImportPaths,
                )}`;
                return {
                  contents: `${transformedContent}
                    ${exportString}`,
                  loader: 'ts',
                };
              }

              return {
                contents: transformedContent,
                loader: 'ts',
              };
            });
          },
        },
      ],
    });
  }
}

async function compilePublicStyles() {
  console.log('Compiling public styles...');
  const publicStyles = glob.sync('src/public/**/*.css');
  esbuild({
    entryPoints: publicStyles.filter(file => !file.includes('_base.css')),
    sourcemap: true,
    outdir: 'app/public/css',
  });
  esbuild({
    entryPoints: publicStyles.filter(file => file.includes('_base.css')),
    bundle: true,
    sourcemap: true,
    outdir: 'app/public/css',
  });
}

async function compileAllPageStyles() {
  const pages = glob.sync('app/pages/**/*.html.js');
  for (const page of pages) {
    compilePageStyles(page, new Map());
  }
}

import { Worker } from 'node:worker_threads';

async function compilePageStyles(file, cache) {
  try {
    const workerResponse = await new Promise((resolve, reject) => {
      const worker = new Worker('./scripts/compileStyles.js', {
        workerData: {
          file,
          cachedStyles: cache,
        },
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });

    if (workerResponse) {
      for (const style of workerResponse) {
        cache.set(file, style);
      }
    }
  } catch (error) {
    console.log('Error compiling page styles:', error);
  }
}
