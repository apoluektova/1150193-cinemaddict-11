import moment from "moment";

export const getShortDescription = (text, maxLength) => {
  let shortDescription = text;
  if (text.length > maxLength) {
    shortDescription = text.slice(0, maxLength);
    shortDescription += `&#133`;
  }
  return shortDescription;
};

export const getFilmDuration = (duration) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const filmDuration = `${hours}h ${minutes}m`;
  return filmDuration;
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

export const getDateFromString = (date) => {
  return moment(date).valueOf();
};
