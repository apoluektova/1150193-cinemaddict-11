const MAX_DESCRIPTION_LENGTH = 139;

const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist `,
  HISTORY: `History `,
  FAVORITES: `Favorites `,
};

const userRank = {
  novice: {
    minFilmsAmount: 1,
    maxFilmsAmount: 10
  },
  fan: {
    minFilmsAmount: 11,
    maxFilmsAmount: 20
  },
  movieBuff: {
    minFilmsAmount: 21
  },
};

export {MAX_DESCRIPTION_LENGTH, FilterType, userRank};
