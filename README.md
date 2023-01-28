# Express + Lit + SSR Web App Template

This is a template for creating an express app that uses the Lit web framework and server-side rendering (SSR) to render web components.

## Structure

- Templates exist in the src/templates folder. They are functions that take two arguments: a Page, and Data. The templates return an HTMLTemplateResult.
- Pages are inside the src/pages folder. They must export a template that will be used to render the page. They must also export a page which is a function that takes one argument: data. Pages can export any arbitrary variables and they will be fed into the data argument. Pages must export a route that determines the path the page is available at, for example: export const route = '/api' will make the page available at /api in the browser. Pages must also export a get function or a post function that will be used when rendering the page. Pages must be a *.*.ts file, for example: index.html.ts.
- All Lit elements should live within the src/components directory. These are compiled twice. Once for the server, and once for the client.

## Usage

To use this template, you will need to have Node.js and npm installed.

1. Clone this repository: git clone https://github.com/WillsonSmith/Lit-SSR-Express-Template
2. Install dependencies: npm install
3. Run the development server: npm start
4. Open your browser to http://localhost:3000 to see the app running

## Limitations

If you want to add variables within the <head> or onto the <html> tags you must append -so to the tag. The render function will strip these out when rendering the page. For example: <title-so>Hello World</title-so>.
This template is set up to use Prisma with SQLite for the database.
