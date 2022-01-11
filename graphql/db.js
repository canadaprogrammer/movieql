export let people = [
  {
    id: 0,
    name: 'Jin',
    age: 20,
    gender: 'male',
  },
  {
    id: 1,
    name: 'Jina',
    age: 20,
    gender: 'female',
  },
  {
    id: 2,
    name: 'Jun',
    age: 15,
    gender: 'male',
  },
  {
    id: 3,
    name: 'Juhee',
    age: 10,
    gender: 'male',
  },
];

export const getPeople = () => people;

export const getById = (id) => people.find((person) => person.id === id);

export const delById = (id) => {
  const removedPeople = people.filter((person) => person.id !== id);
  if (people.length > removedPeople.length) {
    people = removedPeople;
    return true;
  } else {
    return false;
  }
};

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
