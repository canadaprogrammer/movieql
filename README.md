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

## Create a GraphQL Sever with GraphQL Yoga

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

    server.start(() =>
      console.log('Graphql Server Running and explore http://localhost:4000')
    );
    ```

- Create `.babelrc`

  - ```babel
    {
      "presets": ["@babel/preset-env"]
    }
    ```

## Create query and resolver

- Create `schema.graphql` and `resolvers.js` on `graphql`

  - `schema.graphql`

    - ```graphql
      type Query {
        name: String!, // ! means required
      }
      ```

  - `resolvers.js`

    - ```js
      const resolvers = {
        Query: {
          name: () => 'Jin',
        },
      };

      export default resolvers;
      ```

- On `index.js`

  - ```js
    import resolvers from './graphql/resolvers';

    const server = new GraphQLServer({
      typeDefs: 'graphql/schema.graphql',
      resolvers,
    });
    ```

- GraphQL on `localhost:4000`

  - ```query
    query {
      name
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "name": "Jin"
        }
      }
      ```

## Extend schema 1

- `schema.graphql`

  - ```graphql
    type Jin {
      name: String!
      age: Int!
      gender: String!
    }

    type Query {
      person: Jin!
    }
    ```

- `resolvers.js`

  - ```js
    const jin = {
      name: 'Jin',
      age: 20,
      gender: 'male',
    };
    const resolvers = {
      Query: {
        person: () => jin,
      },
    };

    export default resolvers;
    ```

- GraphQL on `localhost:4000`

  - ```query
    query {
      person {
        name
        age
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "person": {
            "name": "Jin",
            "age": 20
          }
        }
      }
      ```

## Extend schema 2

- `schema.graphql`

  - ```graphql
    type Person {
      id: Int!
      name: String!
      age: Int!
      gender: String!
    }

    type Query {
      people: [Person]!
      person(id: Int!): Person
    }
    ```

- Create `/graphql/db.js`

  - ```js
    export const people = [
      {
        id: 0,
        name: 'Jin',
        age: 20,
        gender: 'male',
      },
      ...{
        id: 5,
        name: 'Jina',
        age: 20,
        gender: 'female',
      },
    ];
    ```

- `resolvers.js`

  - ```js
    import { people } from './db';

    const resolvers = {
      Query: {
        people: () => people,
      },
    };

    export default resolvers;
    ```

- GraphQL on `localhost:4000`

  - ```query
    query {
      people {
        id
        name
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "people": [
            {
              "id": 0,
              "name": "Jin"
            },
            ...
            {
              "id": 5,
              "name": "Jina"
            }
          ]
        }
      }
      ```

## create queries with arguments

- `db.js`

  - ```js
    export const getById = (id) => people.find((person) => person.id === id);
    ```

- `resolvers.js`

  - ```js
    import { people, getById } from './db';

    const resolvers = {
      Query: {
        people: () => people,
        person: (_, { id }) => getById(id),
      },
    };
    ```

- GraphQL on `localhost:4000`

  - ```query
    {
      person(id:0) {
        name
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "person": {
            "name": "Jin"
          }
        }
      }
      ```
