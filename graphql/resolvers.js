import { people, getById, delById, addPerson } from './db';

const resolvers = {
  Query: {
    people: () => people,
    person: (_, { id }) => getById(id),
  },
  Mutation: {
    addPerson: (_, { name, age, gender }) => addPerson(name, age, gender),
    delPerson: (_, { id }) => delById(id),
  },
};

export default resolvers;
