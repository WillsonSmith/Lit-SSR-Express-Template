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
  const files = glob.sync('src/components/**/*.ts');
  esbuild({
    entryPoints: files,
    bundle: true,
    splitting: true,
    sourcemap: true,
    format: 'esm',
    platform: 'browser',
    outdir: 'app/client',
  });
}

function compileServer() {
  const filesOutsideOfClient = glob
    .sync('src/**/*.ts')
    .filter((file) => !file.startsWith('src/components'));
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
