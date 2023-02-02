import { config } from 'dotenv';
config();

import express from 'express';
const app = express();
const port = 3000;

import session from 'express-session';

import { renderPage } from './renderer/render.js';
import glob from 'glob';

import { join } from 'path';
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

import prisma from './db/client.js';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: 'auto',
      httpOnly: true,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // prune expired entries every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${__dirname}public`));

const nodeModules = join(__dirname, '..', 'node_modules');
app.use(
  '/public/shoelace',
  express.static(join(nodeModules, '@shoelace-style/shoelace/dist'))
);

const pagePaths = glob.sync(`${__dirname}/pages/**/*.*.js`);
for (const pagePath of pagePaths) {
  const pageImport = await import(pagePath);
  const routePath = pageImport.route;
  const get = pageImport.get;
  const post = pageImport.post;
  const middleware = pageImport.middleware || [];

  get && app.get(routePath, ...middleware, get);
  post && app.post(routePath, ...middleware, post);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
