const Movie = require('../models/movie');

const ERROR_MESSAGE = {
  notValid: 'Переданы некорректные данные.',
  notFound: 'Фильм с указанным _id не найден.',
};

const { handleError, checkDataFound, ForbiddenError } = require('../utils/errors');

module.exports.createMovie = (req, res, next) => {
  const movieData = req.body;
  movieData.owner = req.user;

  Movie.create(movieData)
    .then((movie) => Movie.findById(movie._id).populate(['owner']))
    .then((movie) => res.send(movie))
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
/*     .populate(['owner']) */
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.deleteMovieByID = (req, res, next) => {
  const movieId = req.params.id;

  Movie.findOne({movieId: movieId})
    .then((movie) => {
      checkDataFound(movie, ERROR_MESSAGE.notFound);
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Запрещено удалять чужие фильмы');
      }
      return Movie.findOneAndRemove({movieId: movieId})
/*         .populate(['owner']); */
    })
    .then((movie) => {
      checkDataFound(movie, ERROR_MESSAGE.notFound);
      res.send(movie);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};
