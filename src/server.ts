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
  try {
    const imported = await import(filePath);
    const markup = await renderPage(imported, options);
    callback(null, markup);
  } catch (error) {
    console.error(error);
    callback(error);
  }
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
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${__dirname}public`));

const nodeModules = join(__dirname, '..', 'node_modules');
app.use('/public/shoelace', express.static(join(nodeModules, '@shoelace-style/shoelace')));

const pagePaths = glob.sync(`${__dirname}/pages/**/*.*.js`);
for (const pagePath of pagePaths) {
  const { route, get, post, middleware = [], handler, action } = await import(pagePath);

  const handlerMiddleware = async (req, res, next) => {
    req.locals ??= {};
    const data = handler ? await handler(req, res) : null;
    if (data) {
      req.locals = {
        ...req.locals,
        ...data,
        authenticated: req.authenticated,
        authenticatedUser: req.user,
      };
    }
    next();
  };

  if (handler) {
    app.get(route, ...middleware, handlerMiddleware, renderIt(pagePath));
  }

  if (action) app.post(route, ...middleware, action);

  if (get) {
    console.warn(`${route}: Get is deprecated, use handler instead.`);
    app.get(route, ...middleware, get);
  }
  if (post) {
    console.warn(`${route}: Post is deprecated, use action instead.`);
    app.post(route, ...middleware, post);
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function renderIt(path) {
  const templatePath = path.replace(`${__dirname}pages/`, '').replace('.html.js', '');
  if (templatePath.endsWith('.js')) return (_, res) => res.send('ok');
  return (req, res) => {
    res.render(templatePath, req.locals);
  };
}
