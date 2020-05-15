import AbstractSmartComponent from "./abstract-smart-component.js";
import {getUserRank} from "./profile-rating.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {formatDate} from "../utils/common.js";

const filterNames = [`All time`, `Today`, `Week`, `Month`, `Year`];
const DEFAULT_FILTER = `all-time`;

const getFilterIdByName = (filterName) => {
  let filterId = ``;
  filterId = (filterName === `All time`) ? `all-time` : filterName.toLowerCase();
  return filterId;
};

const createFilterMarkup = (filters) => {
  return filters
  .map((filter) => {
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${getFilterIdByName(filter)}" value="${getFilterIdByName(filter)}" ${filter === `All time` ? `checked` : ``}>
      <label for="statistic-${getFilterIdByName(filter)}" class="statistic__filters-label">${filter}</label>`
    );
  })
  .join(`\n`);
};

const getWatchedFilmsAmount = (films) => {
  return films.filter((film) => !film.alreadyWatched).length;
};

const getTotalFilmDuration = (films) => {
  let totalDuration = {
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
    film.genre.forEach((it) => {
      if (!filmGenres.includes(it)) {
        filmGenres.push(it);
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


const createStatisticsTemplate = (films) => {
  const filterMarkup = createFilterMarkup(filterNames);
  const watchedFilmsAmount = getWatchedFilmsAmount(films);
  const userRank = getUserRank(films);
  const watchedFilms = films.filter((film) => !film.alreadyWatched);
  const totalFilmDuration = getTotalFilmDuration(watchedFilms);
  const filmsByGenres = getFilmsAmountByGenre(films);
  const topGenre = films.length ? filmsByGenres[0].genre : ``;

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
        <p class="statistic__item-text">${watchedFilmsAmount} <span class="statistic__item-description">movies</span></p>
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
      labels: chartData.map((it) => it.genre),
      datasets: [{
        data: chartData.map((it) => it.count),
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
  debugger;
  switch (filter) {
    case `all-time`:
      return films;
    case `today`:
      return films.filter((film) => moment(film.watchingDate).isSame(moment(), `day`));
    case `week`:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(7, `days`)));
    case `month`:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `months`)));
    case `year`:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `years`)));
  }

  return films;
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

  getTemplate() {
    return createStatisticsTemplate(this._films);
  }

  show(updatedFilms) {
    super.show();

    this._films = updatedFilms;
    this.rerender();
  }

  recoveryListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();

    this._renderChart();
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
