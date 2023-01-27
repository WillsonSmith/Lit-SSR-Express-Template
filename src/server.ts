import { config } from 'dotenv';
config();

import express from 'express';
const app = express();
const port = 3000;

import { renderPage } from './renderer/render.js';
import glob from 'glob';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

app.engine('html.js', async (filePath, options, callback) => {
  const imported = await import(filePath);
  const markup = await renderPage(imported, options);
  callback(null, markup);
});
app.set('views', `${__dirname}/pages`);
app.set('view engine', 'html.js');

const pages = glob.sync(`${__dirname}/pages/**/*.html.js`);

for (const pagePath of pages) {
  const pageImport = await import(pagePath);
  const { route: routePath, get } = pageImport;
  app.get(routePath, get);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
