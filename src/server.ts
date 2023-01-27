import { config } from 'dotenv';
config();

import express from 'express';
const app = express();
const port = 3000;

import { renderPage } from './renderer/render.js';
import glob from 'glob';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pageDir = `${__dirname}pages`;

app.engine('html.js', async (filePath, options, callback) => {
  const imported = await import(filePath);
  const markup = await renderPage(imported, options);
  callback(null, markup);
});
app.set('views', pageDir);
app.set('view engine', 'html.js');

const pagePaths = glob.sync(`${__dirname}/pages/**/*.*.js`);
for (const pagePath of pagePaths) {
  const pageImport = await import(pagePath);
  const routePath = pageImport.route;
  const get = pageImport.get;
  const post = pageImport.post;
  get && app.get(routePath, get);
  post && app.post(routePath, post);
}

app.use('/public', express.static(`${__dirname}public`));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
