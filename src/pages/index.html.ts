import { html } from 'lit';
export { template } from '../templates/root.template.js';

export const title = 'Index';
export const description = 'Index page';

export const page = () => html` <h1>Hello World!</h1> `;

export const get = async (req, res) => {
  res.render('index');
};
export const route = '/';
