import glob from 'glob';
import choki from 'chokidar';
import { build as esbuild } from 'esbuild';
import { ensureSymlink } from 'fs-extra';

compileClient();
compileServer();
processCSS();

if (process.argv.includes('--watch')) {
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

function compileServer() {
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
