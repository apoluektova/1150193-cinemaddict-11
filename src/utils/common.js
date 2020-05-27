import moment from "moment";

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

const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

const getDateFromString = (date) => {
  return moment(date).valueOf();
};

export {getShortDescription, getFilmDuration, formatDate, formatCommentDate, getDateFromString};
