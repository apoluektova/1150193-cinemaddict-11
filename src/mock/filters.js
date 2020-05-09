const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`
];

export const generateFilters = () => {
  return filterNames.map((filter) => {
    return {
      name: filter,
      count: Math.floor(Math.random() * 10),
    };
  });
};
