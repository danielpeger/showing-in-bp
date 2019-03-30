import React from "react";
import { Link } from "gatsby";

export default ({ pageContext: { movies } }) => (
  <ol>
    {movies.map(movie => (
      <li>
        <Link to={`/movie/${movie.title}`}>{movie.title}</Link>
        <div>{movie.description}</div>
        <div>Imdb: {movie.imdbRating}</div>
        <div>Metacritic: {movie.metaScore}</div>
        <div>Rotten Tomatoes: {movie.tomatoMeter}</div>
      </li>
    ))}
  </ol>
);
