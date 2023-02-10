// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import glob from 'glob';
import choki from 'chokidar';
import { build as esbuild } from 'esbuild';
import { ensureSymlink } from 'fs-extra';

// compileClient();
compileServer();
// processCSS();

if (process.argv.includes('--watch')) {
  // I think this is good to stay. It should be efficient.
  choki.watch(['app/pages/**/*.html.js']).on('all', (_, file) => {
    // compilePageStyles(file);
  });
  choki.watch(['src/pages/**/*.html.ts']).on('all', (_, file) => {
    hydrateComponents(file);
  });
  // I should rework everything following this line.
  // How do I want to find the files that need to be recompiled?
  // use a import 'filepath.client' to find the files that need to be recompiled?
  // I kinda like that idea. hmmm.
  // `import component.js?hydrate=true`?
  // creates an export string that is used to hydrate the component.
  // Use all `components/` folders as entry points?

  if (false) {
    choki.watch(['src/public/**/*.ts']).on('all', () => {
      compileClient();
    });
    choki.watch('src/**/*.ts').on('all', () => {
      compileServer();
    });
    choki.watch('src/**/*.css').on('all', () => {
      processCSS();
    });
  }
}

import { readFile } from 'fs/promises';

function hydrateComponents(file) {
  // use esbuild and find any imports that have a query string of `hydrate=true`
  // If the import has a hydrate query string then the file should be added to a list to post-process
  // esbuild should strip the query string and then add an `export components = ['without/query/string']`

  const pages = glob.sync('src/pages/**/*.ts');
  esbuild({
    entryPoints: pages,
    bundle: false,
    splitting: false,
    sourcemap: true,
    format: 'esm',
    platform: 'node',
    outdir: 'app',
    outbase: 'src',
    plugins: [
      {
        name: 'hydrate',
        setup(build) {
          build.onResolve({ filter: /\.html\.ts$/ }, args => {
            // console.log(args);
            return {
              namespace: 'hydrate',
              path: args.path,
            };
          });

          build.onLoad({ filter: /.*/, namespace: 'hydrate' }, async args => {
            const file = args.path;

            const content = await readFile(file, 'utf-8');
            // replace `import "components/component.js?hydrate=true"` with `import "components/component.js"`
            // add `export components = ['components/component.js']` to the end of the file
            // return the new content
            const transformedContent = content.replace(
              /import\s+["'](.+?)\?hydrate=true["']/g,
              'import "$1"',
            );

            // add `export components = ['components/component.js']` to the end of the file
            const components = content.match(/import\s+["'](.+?)\?hydrate=true["']/g);
            if (components) {
              const componentImports = components.map(component => {
                const match = component.match(/import\s+["'](.+?)\?hydrate=true["']/);
                return match[1];
              });
              const exportString = `export const components = ${JSON.stringify(componentImports)}`;
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

  const componentDirFiles = glob.sync('src/**/components/**/*.ts');
  const publicJs = glob.sync('src/public/**/*.ts');

  const componentOutFiles = componentDirFiles.map(file => {
    const fileName = file.split('/').pop();
    const dir = file.split('/').slice(0, -1).join('/');
    const newFile = `${dir}/${fileName.replace('.ts', '.js')}`
      .replace('src', 'app')
      .replace('components/', 'components/client/');
    return newFile;
  });

  // this is going to be complex.
  // I have not considered that these relative files will be referencing other relative files and the directories will not be the same.
  // hmmm.

  const publicOutFiles = publicJs.map(file => {
    const fileName = file.split('/').pop();
    const dir = file.split('/').slice(0, -1).join('/');
    const newFile = `${dir}/${fileName.replace('.ts', '.js')}`.replace('src', 'app');
    return newFile;
  });

  const componentDirs = componentDirFiles.map(file => {
    const dir = file.split('/').slice(0, -1).join('/');
    return dir;
  });

  console.log(componentDirs);
  console.log(componentOutFiles);
  console.log(publicOutFiles);

  // use esbuild to compile the files

  // esbuild({
  //   entryPoints: [...componentDirs, ...publicJs],
  //   bundle: true,
  //   splitting: true,
  //   sourcemap: true,
  //   format: 'esm',
  //   platform: 'browser',
  //   outdir: 'app',
  //   outbase: 'src',
  //   plugins: [],
  // });
}

function compileClient() {
  const components = glob.sync('src/public/components/**/*.ts');
  const publicFiles = glob
    .sync('src/public/**/*.ts')
    .filter(file => !file.startsWith('src/public/components'));

  const buildArgs = {
    bundle: true,
    splitting: true,
    sourcemap: true,
    format: 'esm',
    platform: 'browser',
  };
  ensureSymlink('src/components', 'src/public/components');

  esbuild({
    ...buildArgs,
    entryPoints: [...components, ...publicFiles],
    outdir: 'app/public',
  });
}

async function compileServer() {
  const components = glob.sync('src/public/components/**/*.ts');
  const filesOutsideOfClient = glob
    .sync('src/**/*.ts')
    .filter(file => !file.startsWith('src/public'));

  ensureSymlink('src/components', 'src/public/components');
  esbuild({
    entryPoints: components,
    bundle: false,
    splitting: false,
    sourcemap: true,
    format: 'esm',
    platform: 'node',
    outdir: 'app',
    outbase: 'src/public',
  });
  esbuild({
    entryPoints: filesOutsideOfClient,
    bundle: false,
    splitting: false,
    sourcemap: true,
    format: 'esm',
    platform: 'node',
    outdir: 'app',
  });
}

function processCSS() {
  const files = glob.sync('src/**/*.css');
  esbuild({
    entryPoints: files.filter(file => !file.includes('_base.css')),
    sourcemap: true,
    outdir: 'app/public/css',
  });
  esbuild({
    entryPoints: files.filter(file => file.includes('_base.css')),
    bundle: true,
    sourcemap: true,
    outdir: 'app/public/css',
  });
}

import { Worker } from 'node:worker_threads';

const cachedStyles = new Set();
async function compilePageStyles(file) {
  try {
    const workerResponse = await new Promise((resolve, reject) => {
      const worker = new Worker('./scripts/compileStyles.js', {
        workerData: {
          file,
          cachedStyles,
        },
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });

    if (workerResponse) {
      for (const style of workerResponse) {
        cachedStyles.add(style);
      }
    }
  } catch (error) {
    console.log('lol', error);
  }
}
