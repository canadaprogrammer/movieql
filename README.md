# Movie API with GraphQL

## Problems Solved by GraphQL

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

## Create Query and Resolver

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

## Extend Schema 1

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

## Extend Schema 2

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

## Create Queries with Arguments

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

## Create Mutation

- On `schema.graphql`

  - ```
    type Mutation {
      addPerson(name: String!, age: Int!, gender: String!): Person!
    }
    ```

- On `db.js`

  - ```js
    export const addPerson = (name, age, gender) => {
      const newPerson = {
        id: people.length,
        name,
        age,
        gender,
      };
      people.push(newPerson);
      return newPerson;
    };
    ```

- On `resolvers.js`

  - ```js
    import { ..., addPerson } from './db';

    const resolvers = {
      ...
      Mutation: {
        addPerson: (_, { name, age, gender }) => addPerson(name, age, gender),
      },
    };
    ```

- GraphQL on `localhost:4000`

  - ```query
    mutation {
      addPerson (name: "Tester", age: 15, gender: "male") {
        id
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "addPerson": {
            "id": 6
          }
        }
      }
      ```

## Delete Mutation

- On `schema.graphql`

  - ```
    type Mutation {
      ...
      delPerson(id: Int!): Boolean!
    }
    ```

- On `db.js`

  - ```js
    export const delById = (id) => {
      const removedPeople = people.filter((person) => person.id !== String(id));
      if (people.length > removedPeople.length) {
        people = removedPeople;
        return true;
      } else {
        return false;
      }
    };
    ```

- On `resolvers.js`

  - ```js
    import { ..., delById } from './db';

    const resolvers = {
      ...
      Mutation: {
        ... ,
        delPerson: (_, { id }) => delById(id),
      },
    };
    ```

- GraphQL on `localhost:4000`

  - ```query
    mutation {
      delPerson(id: 4)
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "delPerson": true
        }
      }
      ```

## Wrap REST API with GraphQL

### Use `node-fetch`

- `yarn add node-fetch@2.6.5`

  - `yarn add node-fetch` installed v3.x, and Error [ERR_REQUIRE_ESM] issued

- On `db.js`

  - ```js
    import fetch from 'node-fetch';

    const API_URL = 'https://yts.mx/api/v2/list_movies.json';
    const prefix = (count) => {
      if (count === 1) {
        return '?';
      }
      if (count === 2) {
        return '&';
      }
    };
    export const getMovies = async (limit, rating) => {
      let REQUEST_URL = API_URL;
      let count = 0;
      if (limit > 0) {
        count++;
        REQUEST_URL += prefix(count) + `limit=${limit}`;
      }
      if (rating > 0) {
        count++;
        REQUEST_URL += prefix(count) + `minimum_rating=${rating}`;
      }
      console.log(REQUEST_URL);
      const response = await fetch(`${REQUEST_URL}`);
      const {
        data: { movies },
      } = await response.json();
      return movies;
    };
    ```

- On `resolvers.js`

  - ```js
    import { getMovies } from './db';

    const resolvers = {
      Query: {
        movies: (_, { limit, rating }) => getMovies(limit, rating),
      },
    };

    export default resolvers;
    ```

- On `schema.graphql`

  - ```
    type Movie {
      id: Int!
      title: String!
      rating: Float!
      summary: String!
      language: String!
      medium_cover_image: String!
    }

    type Query {
      movies(limit: Int, rating: Int): [Movie]!
    }
    ```

- GraphQL on `localhost:4000`

  - ```query
    query {
      movies(rating:9, limit:3) {
        title
        rating
        summary
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "movies": [
            {
              "title": "Days of Reckoning: The Making of Universal Soldier 4",
              "rating": 9.1,
              "summary": ""
            },
      ```

### Use `axios`

- `yarn add axios`

- On `db.js`

  - ```js
    import axios from 'axios';
    const BASE_URL = 'https://yts.mx/api/v2/';
    const LIST_MOVIES_URL = `${BASE_URL}list_movies.json`;
    const MOVIE_DETAILS_URL = `${BASE_URL}movie_details.json`;
    const MOVIE_SUGGESTIONS_URL = `${BASE_URL}movie_suggestions.json`;

    export const getMovies = async (limit, rating) => {
      const {
        data: {
          data: { movies },
        },
      } = await axios(LIST_MOVIES_URL, {
        params: {
          limit,
          minimum_rating: rating,
        },
      });
      return movies;
    };

    export const getMovie = async (id) => {
      const {
        data: {
          data: { movie },
        },
      } = await axios(MOVIE_DETAILS_URL, {
        params: {
          movie_id: id,
        },
      });
      return movie;
    };

    export const getSuggestions = async (id) => {
      const {
        data: {
          data: { movies },
        },
      } = await axios(MOVIE_SUGGESTIONS_URL, {
        params: {
          movie_id: id,
        },
      });
      return movies;
    };
    ```

- On `resolver.js`

  - ```js
    import { getMovies, getMovie, getSuggestions } from './db';

    const resolvers = {
      Query: {
        movies: (_, { rating, limit }) => getMovies(limit, rating),
        movie: (_, { id }) => getMovie(id),
        suggestions: (_, { id }) => getSuggestions(id),
      },
    };

    export default resolvers;
    ```

- On `schema.graphql`

  - ```
    type Movie {
      id: Int!
      title: String!
      rating: Float
      description_full: String
      language: String
      medium_cover_image: String
      genres: [String]
    }

    type Query {
      movies(limit: Int, rating: Int): [Movie]!
      movie(id: Int!): Movie
      suggestions(id: Int!): [Movie]!
    }
    ```

- GraphQL on `localhost:4000`

  - ```query
    query {
      movie(id:38789) {
        title
        rating
        description_full
      }
      suggestions(id:38789) {
        title
        rating
        description_full
      }
    }
    ```

  - the result

    - ```query
      {
        "data": {
          "movie": {
            "title": "Down, But Not Out!",
            "rating": 9,
            "description_full": "\"Down, But Not Out!\" captures all the action of four amateur women ..."
          },
          "suggestions": [
            {
              "title": "Kate: The Making of a Modern Queen",
              "rating": 6.2,
              "description_full": "A profile of the Duchess of Cambridge, exploring her transformation ..."
            },
      ```
