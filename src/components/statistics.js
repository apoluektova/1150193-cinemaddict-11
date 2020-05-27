import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {getUserRank} from "./profile-rating.js";

const FILTER_NAMES = [`All time`, `Today`, `Week`, `Month`, `Year`];
const DEFAULT_FILTER = `all-time`;

const Filter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getFilterIdByName = (filterName) => {
  return (filterName === `All time`) ? `all-time` : filterName.toLowerCase();
};

const createFilterMarkup = (filter) => {
  return FILTER_NAMES
  .map((name) => {
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${getFilterIdByName(name)}" value="${getFilterIdByName(name)}" ${getFilterIdByName(name) === filter ? `checked` : ``}>
      <label for="statistic-${getFilterIdByName(name)}" class="statistic__filters-label">${name}</label>`
    );
  })
  .join(`\n`);
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.alreadyWatched);
};

const getTotalFilmDuration = (films) => {
  const totalDuration = {
    hours: 0,
    minutes: 0,
  };
  const totalFilmDuration = films.reduce((total, film) => total + film.duration, 0);
  totalDuration.hours = Math.floor(totalFilmDuration / 60);
  totalDuration.minutes = totalFilmDuration % 60;
  return totalDuration;
};

const getFilmGenres = (films) => {
  return films.reduce((filmGenres, film) => {
    film.genre.forEach((genre) => {
      if (!filmGenres.includes(genre)) {
        filmGenres.push(genre);
      }
    });
    return filmGenres;
  }, []);
};

const getFilmsAmountByGenre = (films) => {
  const filmGenres = getFilmGenres(films);

  return filmGenres.map((genre) => {
    return {
      genre,
      count: films.filter((film) => film.genre.includes(genre)).length,
    };
  }).sort((a, b) => b.count - a.count);
};

const createStatisticsTemplate = (films, filter) => {
  const watchedFilms = getWatchedFilms(films);
  const filterMarkup = createFilterMarkup(filter);
  const watchedFilmsByFilter = getFilmsByFilter(films, filter);
  const watchedFilmsByFilterAmount = watchedFilmsByFilter.length;
  const userRank = getUserRank(films);
  const totalFilmDuration = getTotalFilmDuration(getFilmsByFilter(films, filter));
  const topGenre = ``;


  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filterMarkup}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsByFilterAmount} <span class="statistic__item-description">${watchedFilms.length === 1 ? `movie` : `movies`}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalFilmDuration.hours} <span class="statistic__item-description">h</span> ${totalFilmDuration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

const renderChart = (genresCtx, films) => {
  const BAR_HEIGHT = 50;
  const chartData = getFilmsAmountByGenre(films);

  genresCtx.height = BAR_HEIGHT * chartData.length;

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.map((label) => label.genre),
      datasets: [{
        data: chartData.map((bar) => bar.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getFilmsByFilter = (films, filter) => {
  let filteredFilms = [];
  const watchedFilms = getWatchedFilms(films);

  switch (filter) {
    case Filter.TODAY:
      filteredFilms = watchedFilms.filter((film) => moment(film.watchingDate).isSame(moment(), `day`));
      break;
    case Filter.WEEK:
      filteredFilms = watchedFilms.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(7, `days`)));
      break;
    case Filter.MONTH:
      filteredFilms = watchedFilms.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `months`)));
      break;
    case Filter.YEAR:
      filteredFilms = watchedFilms.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `years`)));
      break;
    case Filter.ALL_TIME:
      filteredFilms = watchedFilms;
      break;
  }

  return filteredFilms;
};

export default class Statistics extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._films = films;
    this._chart = null;
    this._renderChart();
    this._filter = DEFAULT_FILTER;
    this._onFilterChange();
  }

  recoveryListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._filter);
  }

  show(updatedFilms) {
    super.show();

    this._films = updatedFilms;
    this.rerender();
  }

  _renderChart() {
    const genresCtx = this.getElement().querySelector(`.statistic__chart`);
    const films = getFilmsByFilter(this._films, this._filter);
    this._resetChart();

    this._chart = renderChart(genresCtx, films);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _onFilterChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
  }
}
