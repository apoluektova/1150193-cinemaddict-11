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

const getShortDescription = (text, maxLength) => {
  let shortDescription = text;
  if (text.length > maxLength) {
    shortDescription = text.slice(0, maxLength);
    shortDescription += `&#133`;
  }
  return shortDescription;
};

const getFilmDuration = (duration) => {
  let hours = Math.floor(duration / 60);
  let minutes = duration % 60;
  const filmDuration = `${hours}h ${minutes}m`;
  return filmDuration;
};

const getMonthName = (monthNumber) => {
  const months = [
    `January`,
    `Fabruary`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];
  return months[monthNumber];
};

const formatDate = (date) => {
  const timestamp = Date.parse(date);
  const parsedDate = new Date(timestamp);
  const day = parsedDate.getDate();
  const month = getMonthName(parsedDate.getMonth());
  const year = parsedDate.getFullYear();
  const fullDate = `${day} ${month} ${year}`;
  return fullDate;
};

const formatCommentDate = (date) => {
  const timestamp = Date.parse(date);
  const parsedDate = new Date(timestamp);
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth();
  const year = parsedDate.getFullYear();
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();
  const commentDate = `${year}/${month}/${day} ${hours}:${minutes}`;
  return commentDate;
};

const getDateFromString = (date) => {
  return new Date(date).valueOf();
};

export {getRandomIntegerNumber, getRandomDecimalNumber, getRandomArrayItem, getRandomArray, getShortDescription, getFilmDuration, formatDate, formatCommentDate, getDateFromString};
