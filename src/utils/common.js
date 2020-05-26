import moment from "moment";

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDecimalNumber = (min, max) => {
  return min + Math.random() * (max - min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const shuffleArray = (array) => {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const getRandomArray = (array, number) => {
  const arrayCopy = array.slice();
  const randomArray = shuffleArray(arrayCopy).slice(0, number);
  return randomArray;
};

// Да
const getShortDescription = (text, maxLength) => {
  let shortDescription = text;
  if (text.length > maxLength) {
    shortDescription = text.slice(0, maxLength);
    shortDescription += `&#133`;
  }
  return shortDescription;
};

// Да
const getFilmDuration = (duration) => {
  let hours = Math.floor(duration / 60);
  let minutes = duration % 60;
  const filmDuration = `${hours}h ${minutes}m`;
  return filmDuration;
};

// Да
const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

const getDateFromString = (date) => {
  return moment(date).valueOf();
};

export {getRandomIntegerNumber, getRandomDecimalNumber, getRandomArrayItem, getRandomArray, getShortDescription, getFilmDuration, formatDate, formatCommentDate, getDateFromString};
