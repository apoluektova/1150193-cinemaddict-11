import {COMMENT_EMOJIS, COMMENT_TEXTS, COMMENT_AUTHORS} from "../const.js";
import {getRandomArrayItem} from "../utils.js";

const generateComment = () => {
  return {
    text: getRandomArrayItem(COMMENT_TEXTS),
    emoji: getRandomArrayItem(COMMENT_EMOJIS),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    date: `2019/12/31 23:59`,
  };
};

const generateComments = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateComment);
};

export {generateComments};
