import glob from 'glob';
import choki from 'chokidar';
import { build as esbuild } from 'esbuild';

compileClient();
compileServer();

if (process.argv.includes('--watch')) {
  choki.watch('src/client/**/*.ts').on('all', (event, path) => {
    compileClient();
  });
  choki.watch('src/**/*.ts').on('all', (event, path) => {
    compileServer();
  });
}

function compileClient() {
  const components = glob.sync('src/components/**/*.ts');
  const publicFiles = glob.sync('src/public/**/*.ts');
  const buildArgs = {
    bundle: true,
    splitting: true,
    sourcemap: true,
    format: 'esm',
    platform: 'browser',
    outdir: 'app/client',
  };

  /* @ts-ignore */
  esbuild({
    ...buildArgs,
    entryPoints: components,
    outdir: 'app/public/components',
  });

  /* @ts-ignore */
  esbuild({
    ...buildArgs,
    entryPoints: publicFiles,
    outdir: 'app/public/js',
  });
}

function compileServer() {
  const filesOutsideOfClient = glob
    .sync('src/**/*.ts')
    .filter((file) => !file.startsWith('src/public'));
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
