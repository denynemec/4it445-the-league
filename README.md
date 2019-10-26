# [4IT445: Agilní vývoj webových aplikací](http://4it445.vse.cz/) na [VŠE](https://www.vse.cz/)

## The League 4

Fantasy league app created by Team 4 as semestral project.

## JavaScript

We will be using [Node.js](https://nodejs.org/) v10.16.2.
New JavaScript features (ES2015) are "enabled" for for all modern browsers with [Babel](https://babeljs.io/).

### Reference

- [JavaScript reference on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Learn ES2015](https://babeljs.io/docs/en/learn) + more:
  - [object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/)

### Literature

- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed)
  - [Up & Going](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/up%20%26%20going/README.md)
  - [Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/scope%20%26%20closures/README.md)
  - [ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/es6%20%26%20beyond/README.md)
- [JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)

### JavaScript Packages

- [yarn CLI docs](https://yarnpkg.com/en/docs/cli/)
- Useful commands:
  - `yarn install` (install local dependencies - based on `package.json` and `yarn.lock` files)
  - `yarn add <package-name>`
  - `yarn <script-name>` (eg. `yarn start`, `yarn prettier`, see `"scripts"` section in `package.json`)
  - `yarn run`
- Search for packages:
  - [npmjs.com](https://www.npmjs.com/)
  - **[js.coach/react](https://js.coach/react)**

### React

- **[React docs](https://reactjs.org/docs/getting-started.html)**
- frontend app is created using [create-react-app](https://create-react-app.dev/)

### Local development

## DB - SSH tunel

- `ssh -L 4242:localhost:3306 USERNAME@vse.handson.pro`
- Change port of DB to 4242 in .env file

## BE

```bash
cd backend/
yarn install
yarn dev
```

## FE

```bash
cd frontend/
yarn install
yarn dev
```
