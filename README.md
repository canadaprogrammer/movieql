# Movie API with GraphQL

## Problems solved by GraphQL

- Over-fetching and Under-fetching

## Install

- ```bash
  git init
  yarn init
  yarn add graphql-yoga
  ```

- Create `.gitignore`

  - ```git
    node_modules
    yarn-error.log
    ```

## Creating a GraphQL Sever with GraphQL Yoga

- ```bash
  yarn add nodemon --dev
  yarn add @babel/cli @babel/core @babel/node @babel/preset-env --dev
  ```

- If you got an error, 'nodemon' is not recognized, when you installed nodemon on global, add `nodemon` to your `package.json` by `yarn add nodemon --dev`

- On `package.json`

  - ```json
    "scripts": {
      "start": "nodemon --exec babel-node"
    }
    ```

- Create `index.js`

  - ```js
    import { GraphQLServer } from 'graphql-yoga';

    const server = new GraphQLServer({});

    server.start(() => console.log('Graphql Server Running'));
    ```

- Create `.babelrc`

  - ```babel
    {
      "presets": ["@babel/preset-env"]
    }
    ```
