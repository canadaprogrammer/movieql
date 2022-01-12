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
